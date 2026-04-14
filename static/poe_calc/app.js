const POE_TYPES = {
  none: { label: "No PoE", watts: 0, rank: 0 },
  poe: { label: "PoE", watts: 15.4, rank: 1 },
  "poe-plus": { label: "PoE+", watts: 30, rank: 2 },
  "poe-plus-plus-60": { label: "PoE++ Type 3", watts: 60, rank: 3 },
  "poe-plus-plus-90": { label: "PoE++ Type 4", watts: 90, rank: 4 },
};

const STORAGE_KEY = "poe-calculator-draft-v1";

const SWITCH_CATALOG = {
  cisco: {
    label: "Cisco",
    lastUpdated: "Built-in reference set",
    models: [
      { family: "Business 350", model: "CBS350-8P-2G", poeBudget: 67, poeType: "poe-plus", poePorts: 8 },
      { family: "Business 350", model: "CBS350-24P-4G", poeBudget: 195, poeType: "poe-plus", poePorts: 24 },
      { family: "Business 350", model: "CBS350-48P-4G", poeBudget: 370, poeType: "poe-plus", poePorts: 48 },
    ],
  },
  netgear: {
    label: "NETGEAR",
    lastUpdated: "Built-in reference set",
    models: [
      { family: "AV Line M4250", model: "GSM4210PX", poeBudget: 220, poeType: "poe-plus", poePorts: 8 },
      { family: "AV Line M4250", model: "GSM4230P", poeBudget: 300, poeType: "poe-plus", poePorts: 24 },
      { family: "AV Line M4250", model: "GSM4230PX", poeBudget: 480, poeType: "poe-plus", poePorts: 24 },
    ],
  },
  aruba: {
    label: "HP Aruba",
    lastUpdated: "Built-in reference set",
    models: [
      { family: "Instant On 1830", model: "8G Class4 PoE (65W)", poeBudget: 65, poeType: "poe-plus", poePorts: 4 },
      { family: "Instant On 1930", model: "JL684B 24G Class4 PoE 370W", poeBudget: 370, poeType: "poe-plus", poePorts: 24 },
      { family: "Instant On 1960", model: "JL809A 48G PoE 600W", poeBudget: 600, poeType: "poe-plus-plus-60", poePorts: 48 },
    ],
  },
};

const elements = {
  switchName: document.querySelector("#switch-name"),
  brand: document.querySelector("#brand"),
  modelSelect: document.querySelector("#model-select"),
  modelSelectGroup: document.querySelector("#model-select-group"),
  manualModelGroup: document.querySelector("#manual-model-group"),
  model: document.querySelector("#model"),
  budget: document.querySelector("#poe-budget"),
  switchType: document.querySelector("#switch-poe-type"),
  portCount: document.querySelector("#port-count"),
  exportCsv: document.querySelector("#export-csv"),
  resetForm: document.querySelector("#reset-form"),
  catalogNote: document.querySelector("#catalog-note"),
  portsContainer: document.querySelector("#ports-container"),
  rowTemplate: document.querySelector("#port-row-template"),
  statusCard: document.querySelector("#status-card"),
  statusDot: document.querySelector("#status-dot"),
  statusLabel: document.querySelector("#status-label"),
  statusMessage: document.querySelector("#status-message"),
  summaryName: document.querySelector("#summary-name"),
  summaryModel: document.querySelector("#summary-model"),
  summaryBudget: document.querySelector("#summary-budget"),
  summaryUsage: document.querySelector("#summary-usage"),
  summaryHeadroom: document.querySelector("#summary-headroom"),
  meterFill: document.querySelector("#meter-fill"),
  meterText: document.querySelector("#meter-text"),
};

const formatWatts = (value) => `${value.toFixed(1)}W`;

function saveState() {
  const rows = [...elements.portsContainer.querySelectorAll(".port-row")].map((row) => ({
    deviceName: row.querySelector(".device-name").value,
    poeType: row.querySelector(".device-poe-type").value,
  }));

  const draft = {
    switchName: elements.switchName.value,
    brand: elements.brand.value,
    modelSelect: elements.modelSelect.value,
    model: elements.model.value,
    budget: elements.budget.value,
    switchType: elements.switchType.value,
    portCount: elements.portCount.value,
    rows,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function createPortRow(index) {
  const fragment = elements.rowTemplate.content.cloneNode(true);
  const row = fragment.querySelector(".port-row");
  row.querySelector(".port-badge").textContent = `Port ${index + 1}`;
  row.querySelector(".device-name").addEventListener("input", updateCalculator);
  row.querySelector(".device-poe-type").addEventListener("change", updateCalculator);
  return fragment;
}

function syncPortRows() {
  const requestedCount = Math.max(1, Number.parseInt(elements.portCount.value, 10) || 1);
  while (elements.portsContainer.children.length < requestedCount) {
    elements.portsContainer.appendChild(createPortRow(elements.portsContainer.children.length));
  }
  while (elements.portsContainer.children.length > requestedCount) {
    elements.portsContainer.lastElementChild.remove();
  }
}

function getStatus(usagePercent) {
  if (usagePercent > 100) return { state: "red", label: "Red", color: "#cf3f2e" };
  if (usagePercent > 90) return { state: "yellow", label: "Yellow", color: "#d39a16" };
  return { state: "green", label: "Green", color: "#238a4c" };
}

function renderModelOptions() {
  const catalog = SWITCH_CATALOG[elements.brand.value];
  if (!catalog) {
    elements.modelSelect.innerHTML = '<option value="">Manual entry</option>';
    elements.modelSelect.disabled = true;
    elements.catalogNote.textContent = "Use manual entry to define a switch that is not in the built-in catalog.";
    return;
  }

  elements.modelSelect.innerHTML = catalog.models.map((item, index) => {
    const poeTypeLabel = POE_TYPES[item.poeType].label;
    return `<option value="${index}">${item.family} | ${item.model} | ${poeTypeLabel} | ${item.poeBudget}W | ${item.poePorts} PoE ports</option>`;
  }).join("");
  elements.modelSelect.disabled = false;
  elements.catalogNote.textContent = `${catalog.label} models use the tool's built-in reference set.`;
}

function applySelectedCatalogModel() {
  const catalog = SWITCH_CATALOG[elements.brand.value];
  if (!catalog) return;
  const selected = catalog.models[Number.parseInt(elements.modelSelect.value, 10) || 0];
  if (!selected) return;
  elements.model.value = selected.model;
  elements.budget.value = selected.poeBudget;
  elements.switchType.value = selected.poeType;
  elements.portCount.value = selected.poePorts;
}

function syncInputMode() {
  const isManual = elements.brand.value === "custom";
  elements.manualModelGroup.hidden = !isManual;
  elements.modelSelectGroup.hidden = isManual;
  elements.model.readOnly = !isManual;
  if (!isManual) applySelectedCatalogModel();
}

function updatePortCompatibility() {
  const switchRank = POE_TYPES[elements.switchType.value].rank;
  [...elements.portsContainer.querySelectorAll(".port-row")].forEach((row) => {
    const type = POE_TYPES[row.querySelector(".device-poe-type").value];
    const compatible = type.rank <= switchRank;
    row.querySelector(".device-watts").textContent = formatWatts(type.watts);
    row.querySelector(".support-note").textContent = compatible ? "Compatible" : "Switch type too low";
    row.querySelector(".support-note").classList.toggle("warning", !compatible);
  });
}

function updateCalculator() {
  syncPortRows();
  updatePortCompatibility();

  const budget = Math.max(0, Number.parseFloat(elements.budget.value) || 0);
  const rows = [...elements.portsContainer.querySelectorAll(".port-row")];
  const totalUsage = rows.reduce((sum, row) => sum + POE_TYPES[row.querySelector(".device-poe-type").value].watts, 0);
  const usagePercent = budget > 0 ? (totalUsage / budget) * 100 : 0;
  const status = getStatus(usagePercent);
  const headroom = budget - totalUsage;
  const incompatibleCount = rows.filter((row) => POE_TYPES[row.querySelector(".device-poe-type").value].rank > POE_TYPES[elements.switchType.value].rank).length;

  elements.statusCard.dataset.state = status.state;
  elements.statusDot.style.backgroundColor = status.color;
  elements.statusLabel.textContent = status.label;
  elements.statusMessage.textContent = status.state === "red"
    ? `Assigned devices exceed the switch budget by ${formatWatts(Math.abs(headroom))}.${incompatibleCount ? ` ${incompatibleCount} port(s) also require a higher PoE type.` : ""}`
    : `The switch has ${formatWatts(Math.max(headroom, 0))} of PoE headroom remaining.${incompatibleCount ? ` ${incompatibleCount} port(s) need a higher PoE type.` : ""}`;
  elements.summaryName.textContent = elements.switchName.value.trim() || "Not set";
  elements.summaryModel.textContent = elements.model.value.trim() || "Not set";
  elements.summaryBudget.textContent = formatWatts(budget);
  elements.summaryUsage.textContent = formatWatts(totalUsage);
  elements.summaryHeadroom.textContent = headroom >= 0 ? `${formatWatts(headroom)} headroom` : `${formatWatts(Math.abs(headroom))} over budget`;
  elements.meterFill.style.width = `${Math.min(usagePercent, 100)}%`;
  elements.meterFill.style.backgroundColor = status.color;
  elements.meterText.textContent = `${usagePercent.toFixed(1)}% of the switch PoE budget is currently assigned.`;
  saveState();
}

function exportCsv() {
  const rows = [[
    "Switch Name", "Model", "Budget", "Usage", "Headroom/Over"
  ]];

  rows.push([
    elements.switchName.value.trim() || "Not set",
    elements.model.value.trim() || "Not set",
    elements.budget.value,
    elements.summaryUsage.textContent,
    elements.summaryHeadroom.textContent,
  ]);

  rows.push([]);
  rows.push(["Port", "Device", "PoE Type", "Estimated Draw"]);

  [...elements.portsContainer.querySelectorAll(".port-row")].forEach((row, index) => {
    const typeValue = row.querySelector(".device-poe-type").value;
    rows.push([
      `Port ${index + 1}`,
      row.querySelector(".device-name").value.trim(),
      POE_TYPES[typeValue].label,
      POE_TYPES[typeValue].watts.toFixed(1),
    ]);
  });

  const csv = rows.map((line) => line.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${(elements.switchName.value.trim() || "poe-calculator").replace(/\s+/g, "_")}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function resetForm() {
  elements.switchName.value = "";
  elements.brand.value = "cisco";
  renderModelOptions();
  elements.modelSelect.value = "0";
  syncInputMode();
  [...elements.portsContainer.querySelectorAll(".port-row")].forEach((row) => {
    row.querySelector(".device-name").value = "";
    row.querySelector(".device-poe-type").value = "none";
  });
  updateCalculator();
}

function restoreState() {
  const draft = loadState();
  if (!draft) return;

  elements.switchName.value = draft.switchName || "";
  elements.brand.value = draft.brand || "cisco";
  renderModelOptions();
  elements.modelSelect.value = draft.modelSelect || "0";
  syncInputMode();
  elements.model.value = draft.model || elements.model.value;
  elements.budget.value = draft.budget || elements.budget.value;
  elements.switchType.value = draft.switchType || elements.switchType.value;
  elements.portCount.value = draft.portCount || elements.portCount.value;
  syncPortRows();

  (draft.rows || []).forEach((savedRow, index) => {
    const row = elements.portsContainer.children[index];
    if (!row) return;
    row.querySelector(".device-name").value = savedRow.deviceName || "";
    row.querySelector(".device-poe-type").value = savedRow.poeType || "none";
  });
}

elements.brand.addEventListener("change", () => {
  renderModelOptions();
  syncInputMode();
  updateCalculator();
});
elements.modelSelect.addEventListener("change", () => {
  applySelectedCatalogModel();
  updateCalculator();
});
[elements.switchName, elements.model, elements.budget, elements.switchType, elements.portCount].forEach((input) => {
  input.addEventListener("input", updateCalculator);
  input.addEventListener("change", updateCalculator);
});
elements.exportCsv.addEventListener("click", exportCsv);
elements.resetForm.addEventListener("click", resetForm);

renderModelOptions();
syncInputMode();
restoreState();
syncPortRows();
updateCalculator();
