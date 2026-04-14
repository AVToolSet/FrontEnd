const STORAGE_KEY = "power-calculator-draft-v1";

const PDU_CATALOG = {
  gude: {
    label: "Gude",
    lastUpdated: "Built-in reference set",
    models: [
      { family: "Expert Power Control", model: "8041-1", voltage: 230, current: 16, outlets: 8 },
      { family: "Expert Power Control", model: "8041-2", voltage: 230, current: 16, outlets: 8 },
      { family: "Expert Power Control", model: "8045-1", voltage: 230, current: 16, outlets: 12 },
      { family: "Expert Power Control", model: "8045-2", voltage: 230, current: 16, outlets: 12 },
      { family: "Expert Power Control", model: "8061-1", voltage: 230, current: 16, outlets: 8 },
      { family: "Expert Power Control", model: "8061-2", voltage: 230, current: 16, outlets: 8 },
      { family: "Expert Power Control", model: "8071-1", voltage: 230, current: 16, outlets: 8 },
      { family: "Expert Power Control", model: "8221-1", voltage: 230, current: 16, outlets: 21 },
      { family: "Expert Power Control", model: "8291-1", voltage: 230, current: 32, outlets: 24 },
      { family: "Expert Power Control", model: "8291-2", voltage: 230, current: 32, outlets: 24 },
    ],
  },
  apc: {
    label: "APC",
    lastUpdated: "Built-in reference set",
    models: [
      { family: "Easy Rack", model: "EPDU1016B", voltage: 230, current: 16, outlets: 8 },
      { family: "Easy Rack", model: "EPDU1016M", voltage: 230, current: 16, outlets: 10 },
      { family: "Easy Rack", model: "EPDU1116B", voltage: 230, current: 16, outlets: 8 },
      { family: "Easy Rack", model: "EPDU1116M", voltage: 230, current: 16, outlets: 12 },
      { family: "Easy Rack", model: "EPDU1216M", voltage: 230, current: 16, outlets: 12 },
      { family: "Easy Rack", model: "EPDU1316M", voltage: 230, current: 16, outlets: 24 },
      { family: "Switched Rack PDU", model: "AP7900B", voltage: 230, current: 16, outlets: 8 },
      { family: "Switched Rack PDU", model: "AP7921B", voltage: 230, current: 16, outlets: 8 },
      { family: "Metered Rack PDU", model: "AP8853", voltage: 230, current: 32, outlets: 24 },
      { family: "Metered Rack PDU", model: "AP8881", voltage: 230, current: 16, outlets: 12 },
      { family: "Metered Rack PDU", model: "AP8886", voltage: 230, current: 32, outlets: 24 },
    ],
  },
  furman: {
    label: "Furman",
    lastUpdated: "Built-in reference set",
    models: [
      { family: "Classic", model: "M-10x E", voltage: 230, current: 10, outlets: 11 },
      { family: "Classic", model: "PL-PLUS C E", voltage: 230, current: 10, outlets: 10 },
      { family: "Classic", model: "PL-PRO DMC E", voltage: 230, current: 10, outlets: 10 },
      { family: "Classic", model: "PL-8C E", voltage: 230, current: 10, outlets: 9 },
      { family: "Classic", model: "M-8x2 E", voltage: 230, current: 10, outlets: 9 },
      { family: "Sequencer", model: "CN-1800S E", voltage: 230, current: 10, outlets: 9 },
      { family: "Sequencer", model: "PS-8R E III", voltage: 230, current: 10, outlets: 8 },
      { family: "Conditioner", model: "P-1400 AR E", voltage: 230, current: 10, outlets: 8 },
    ],
  },
  "austin-hughes": {
    label: "Austin Hughes",
    lastUpdated: "Built-in reference set",
    models: [
      { family: "Basic PDU", model: "PDU-8C13-16A", voltage: 230, current: 16, outlets: 8 },
      { family: "Basic PDU", model: "PDU-8UK-13A", voltage: 230, current: 13, outlets: 8 },
      { family: "Basic PDU", model: "PDU-12C13-16A", voltage: 230, current: 16, outlets: 12 },
      { family: "Basic PDU", model: "PDU-16C13-16A", voltage: 230, current: 16, outlets: 16 },
      { family: "Basic PDU", model: "PDU-24C13-32A", voltage: 230, current: 32, outlets: 24 },
      { family: "Metered PDU", model: "PDU-8M-16A", voltage: 230, current: 16, outlets: 8 },
      { family: "Metered PDU", model: "PDU-12M-16A", voltage: 230, current: 16, outlets: 12 },
      { family: "Metered PDU", model: "PDU-24M-32A", voltage: 230, current: 32, outlets: 24 },
      { family: "Switched PDU", model: "PDU-8S-16A", voltage: 230, current: 16, outlets: 8 },
    ],
  },
  raritan: {
    label: "Raritan",
    lastUpdated: "Built-in reference set",
    models: [
      { family: "PX3", model: "PX3-5143R", voltage: 230, current: 16, outlets: 8 },
      { family: "PX3", model: "PX3-5145R", voltage: 230, current: 16, outlets: 12 },
      { family: "PX3", model: "PX3-5190R", voltage: 230, current: 16, outlets: 20 },
      { family: "PX3", model: "PX3-5462R", voltage: 230, current: 32, outlets: 20 },
      { family: "PX3", model: "PX3-5466V", voltage: 230, current: 32, outlets: 24 },
      { family: "PX4", model: "PX4-5145R", voltage: 230, current: 16, outlets: 12 },
      { family: "PX4", model: "PX4-5522R", voltage: 230, current: 32, outlets: 24 },
      { family: "PX4", model: "PX4-5526R", voltage: 230, current: 32, outlets: 24 },
      { family: "PX4", model: "PX4-5562V", voltage: 230, current: 32, outlets: 24 },
    ],
  },
  "server-technology": {
    label: "Server Technology",
    lastUpdated: "Built-in reference set",
    models: [
      { family: "Smart CDU", model: "CW-12V2-C20M10", voltage: 230, current: 16, outlets: 10 },
      { family: "Smart CDU", model: "CW-16V2-C20M12", voltage: 230, current: 16, outlets: 12 },
      { family: "Smart CDU", model: "CW-24V2-L6-30P24", voltage: 230, current: 32, outlets: 24 },
      { family: "Smart CDU", model: "PRO2X 12HD", voltage: 230, current: 16, outlets: 12 },
      { family: "Smart CDU", model: "PRO2X Cx", voltage: 230, current: 32, outlets: 24 },
      { family: "Basic CDU", model: "CB-12V-16A", voltage: 230, current: 16, outlets: 12 },
      { family: "Basic CDU", model: "CB-16V-16A", voltage: 230, current: 16, outlets: 16 },
      { family: "Basic CDU", model: "CB-24V-32A", voltage: 230, current: 32, outlets: 24 },
      { family: "Switched CDU", model: "CS-16V-16A", voltage: 230, current: 16, outlets: 16 },
    ],
  },
};

const elements = {
  pduName: document.querySelector("#pdu-name"),
  brand: document.querySelector("#brand"),
  modelSelect: document.querySelector("#model-select"),
  modelSelectGroup: document.querySelector("#model-select-group"),
  manualModelGroup: document.querySelector("#manual-model-group"),
  model: document.querySelector("#model"),
  voltage: document.querySelector("#supply-voltage"),
  current: document.querySelector("#rated-current"),
  outletCount: document.querySelector("#outlet-count"),
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
  summarySafeLoad: document.querySelector("#summary-safe-load"),
  summaryLimitLoad: document.querySelector("#summary-limit-load"),
  summaryUsage: document.querySelector("#summary-usage"),
  summaryCurrent: document.querySelector("#summary-current"),
  summaryHeadroom: document.querySelector("#summary-headroom"),
  meterFill: document.querySelector("#meter-fill"),
  meterText: document.querySelector("#meter-text"),
};

const formatWatts = (value) => `${Math.round(value)}W`;
const formatCurrent = (value) => `${value.toFixed(2)}A`;

function defaultCatalogModelIndex(brand) {
  if (!PDU_CATALOG[brand]) return "";
  return "0";
}

function saveState() {
  const rows = [...elements.portsContainer.querySelectorAll(".port-row")].map((row) => ({
    deviceName: row.querySelector(".device-name").value,
    wattage: row.querySelector(".device-wattage-input").value,
  }));

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
    pduName: elements.pduName.value,
    brand: elements.brand.value,
    modelSelect: elements.modelSelect.value,
    model: elements.model.value,
    voltage: elements.voltage.value,
    current: elements.current.value,
    outletCount: elements.outletCount.value,
    rows,
  }));
}

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Failed to load Power Calculator draft", error);
    return null;
  }
}

function downloadCsvInBrowser(fileName, csv) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function createOutletRow(index) {
  const fragment = elements.rowTemplate.content.cloneNode(true);
  const row = fragment.querySelector(".port-row");
  row.dataset.outletIndex = String(index);
  row.querySelector(".port-badge").textContent = `Outlet ${index + 1}`;
  row.querySelector(".device-name").addEventListener("input", updateCalculator);
  row.querySelector(".device-wattage-input").addEventListener("input", updateCalculator);
  row.querySelector(".device-wattage-input").addEventListener("change", updateCalculator);
  return fragment;
}

function syncOutletRows() {
  const requestedCount = Math.max(1, Number.parseInt(elements.outletCount.value, 10) || 1);
  const currentCount = elements.portsContainer.children.length;

  if (currentCount < requestedCount) {
    for (let index = currentCount; index < requestedCount; index += 1) {
      elements.portsContainer.appendChild(createOutletRow(index));
    }
  } else if (currentCount > requestedCount) {
    for (let index = currentCount; index > requestedCount; index -= 1) {
      elements.portsContainer.lastElementChild.remove();
    }
  }
}

function getStatus(usagePercent) {
  if (usagePercent > 100) return { state: "red", label: "Red", color: "#c24935" };
  if (usagePercent > 80) return { state: "yellow", label: "Yellow", color: "#bf8a18" };
  return { state: "green", label: "Green", color: "#2d7d46" };
}

function renderModelOptions() {
  const catalog = PDU_CATALOG[elements.brand.value];
  if (!catalog) {
    elements.modelSelect.innerHTML = '<option value="">Manual entry</option>';
    elements.modelSelect.disabled = true;
    elements.catalogNote.textContent = "Use manual entry to define a PDU that is not in the built-in catalog.";
    return;
  }

  elements.modelSelect.innerHTML = catalog.models
    .map((item, index) => `<option value="${index}">${item.family} | ${item.model} | ${item.voltage}V | ${item.current}A | ${item.outlets} outlets</option>`)
    .join("");
  elements.modelSelect.disabled = false;
  elements.catalogNote.textContent = `${catalog.label} models use the tool's built-in reference set.`;
}

function applySelectedCatalogModel() {
  const catalog = PDU_CATALOG[elements.brand.value];
  if (!catalog) return;
  const selectedModel = catalog.models[Number.parseInt(elements.modelSelect.value, 10) || 0];
  if (!selectedModel) return;

  elements.model.value = selectedModel.model;
  elements.voltage.value = selectedModel.voltage;
  elements.current.value = selectedModel.current;
  elements.outletCount.value = selectedModel.outlets;
}

function syncInputMode() {
  const isManual = elements.brand.value === "custom";
  elements.manualModelGroup.hidden = !isManual;
  elements.modelSelectGroup.hidden = isManual;
  elements.model.readOnly = !isManual;
  if (!isManual) applySelectedCatalogModel();
}

function restoreState() {
  const draft = loadState();
  if (!draft) return;

  elements.pduName.value = draft.pduName || "";
  elements.brand.value = draft.brand || "gude";
  renderModelOptions();
  elements.modelSelect.value = draft.modelSelect || defaultCatalogModelIndex(elements.brand.value);
  syncInputMode();
  elements.model.value = draft.model || elements.model.value;
  elements.voltage.value = draft.voltage || elements.voltage.value;
  elements.current.value = draft.current || elements.current.value;
  elements.outletCount.value = draft.outletCount || elements.outletCount.value;
  syncOutletRows();

  (draft.rows || []).forEach((savedRow, index) => {
    const row = elements.portsContainer.children[index];
    if (!row) return;
    row.querySelector(".device-name").value = savedRow.deviceName || "";
    row.querySelector(".device-wattage-input").value = savedRow.wattage || "0";
  });
}

function updateOutletCurrents(voltage) {
  [...elements.portsContainer.querySelectorAll(".port-row")].forEach((row) => {
    const wattage = Math.max(0, Number.parseFloat(row.querySelector(".device-wattage-input").value) || 0);
    const current = voltage > 0 ? wattage / voltage : 0;
    row.querySelector(".device-current").textContent = formatCurrent(current);
    row.querySelector(".support-note").textContent = wattage > 0 ? "Counted in total load" : "Within limit";
  });
}

function updateCalculator() {
  syncOutletRows();

  const voltage = Math.max(1, Number.parseFloat(elements.voltage.value) || 230);
  const ratedCurrent = Math.max(0, Number.parseFloat(elements.current.value) || 0);
  const safeCurrent = ratedCurrent * 0.8;
  const limitWatts = voltage * ratedCurrent;
  const safeWatts = voltage * safeCurrent;

  updateOutletCurrents(voltage);

  const rows = [...elements.portsContainer.querySelectorAll(".port-row")];
  const totalWatts = rows.reduce((sum, row) => sum + Math.max(0, Number.parseFloat(row.querySelector(".device-wattage-input").value) || 0), 0);
  const totalCurrent = voltage > 0 ? totalWatts / voltage : 0;
  const usagePercent = ratedCurrent > 0 ? (totalCurrent / ratedCurrent) * 100 : 0;
  const status = getStatus(usagePercent);
  const headroomWatts = safeWatts - totalWatts;

  elements.statusCard.dataset.state = status.state;
  elements.statusDot.style.backgroundColor = status.color;
  elements.statusDot.style.boxShadow = `0 0 0 8px ${status.color}22`;
  elements.statusLabel.textContent = status.label;
  elements.summaryName.textContent = elements.pduName.value.trim() || "Not set";
  elements.summaryModel.textContent = elements.model.value.trim() || "Not set";
  elements.summarySafeLoad.textContent = formatWatts(safeWatts);
  elements.summaryLimitLoad.textContent = formatWatts(limitWatts);
  elements.summaryUsage.textContent = formatWatts(totalWatts);
  elements.summaryCurrent.textContent = formatCurrent(totalCurrent);
  elements.meterFill.style.width = `${Math.min(usagePercent, 100)}%`;
  elements.meterFill.style.backgroundColor = status.color;
  elements.meterText.textContent = `${usagePercent.toFixed(1)}% of the PDU current rating is currently assigned.`;

  if (status.state === "red") {
    const overByWatts = totalWatts - limitWatts;
    elements.statusMessage.textContent = `Assigned devices exceed the PDU rating by ${formatWatts(Math.max(overByWatts, 0))}.`;
    elements.summaryHeadroom.textContent = `${formatWatts(Math.max(totalWatts - safeWatts, 0))} above safe load`;
  } else if (status.state === "yellow") {
    elements.statusMessage.textContent = `The PDU is still within its rating, but it is above the recommended 80% operating limit.`;
    elements.summaryHeadroom.textContent = `${formatWatts(Math.max(headroomWatts, 0))} safe headroom`;
  } else {
    elements.statusMessage.textContent = `The PDU has ${formatWatts(Math.max(headroomWatts, 0))} of safe operating headroom remaining.`;
    elements.summaryHeadroom.textContent = `${formatWatts(Math.max(headroomWatts, 0))} safe headroom`;
  }

  saveState();
}

function exportCsv() {
  const voltage = Math.max(1, Number.parseFloat(elements.voltage.value) || 230);
  const ratedCurrent = Math.max(0, Number.parseFloat(elements.current.value) || 0);
  const safeCurrent = ratedCurrent * 0.8;
  const totalWatts = [...elements.portsContainer.querySelectorAll(".port-row")].reduce(
    (sum, row) => sum + Math.max(0, Number.parseFloat(row.querySelector(".device-wattage-input").value) || 0),
    0,
  );

  const lines = [
    ["PDU Name", elements.pduName.value.trim() || "Not set"],
    ["Manufacturer", elements.brand.value === "custom" ? "Custom / Manual Entry" : (PDU_CATALOG[elements.brand.value]?.label || elements.brand.value)],
    ["Model", elements.model.value.trim() || "Not set"],
    ["Supply Voltage (V)", String(voltage)],
    ["Rated Current (A)", String(ratedCurrent)],
    ["Recommended Safe Current (A)", safeCurrent.toFixed(2)],
    ["Outlet Count", String(elements.outletCount.value)],
    ["Total Device Usage (W)", totalWatts.toFixed(1)],
    ["Estimated Current Draw (A)", (totalWatts / voltage).toFixed(2)],
    [],
    ["Outlet", "Device", "Estimated Draw (W)", "Estimated Current (A)"],
  ];

  [...elements.portsContainer.querySelectorAll(".port-row")].forEach((row, index) => {
    const watts = Math.max(0, Number.parseFloat(row.querySelector(".device-wattage-input").value) || 0);
    lines.push([
      `Outlet ${index + 1}`,
      row.querySelector(".device-name").value.trim(),
      watts.toFixed(1),
      (watts / voltage).toFixed(2),
    ]);
  });

  const csv = lines.map((line) => line.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const fileStem = (elements.pduName.value.trim() || elements.model.value.trim() || "pdu_load_planner").replace(/[<>:"/\\|?*]+/g, "_").replace(/\s+/g, "_");
  downloadCsvInBrowser(`${fileStem}.csv`, csv);
}

function resetForm() {
  elements.pduName.value = "";
  elements.brand.value = "gude";
  renderModelOptions();
  elements.modelSelect.value = defaultCatalogModelIndex("gude");
  syncInputMode();
  [...elements.portsContainer.querySelectorAll(".port-row")].forEach((row) => {
    row.querySelector(".device-name").value = "";
    row.querySelector(".device-wattage-input").value = "0";
  });
  updateCalculator();
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
[elements.pduName, elements.model, elements.voltage, elements.current, elements.outletCount].forEach((input) => {
  input.addEventListener("input", updateCalculator);
  input.addEventListener("change", updateCalculator);
});
elements.exportCsv.addEventListener("click", exportCsv);
elements.resetForm.addEventListener("click", resetForm);

renderModelOptions();
syncInputMode();
restoreState();
syncOutletRows();
updateCalculator();
