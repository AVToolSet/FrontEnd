const STORAGE_KEY = "speaker-load-planner-v2";

const AMP_CATALOG = {
  extron: {
    label: "Extron",
    models: [
      { model: "XPA U 2002", powerPerChannel: 200, ratedImpedance: 4, channelCount: 2 },
      { model: "XPA U 2004", powerPerChannel: 200, ratedImpedance: 4, channelCount: 4 },
      { model: "XPA 1002", powerPerChannel: 100, ratedImpedance: 8, channelCount: 2 },
      { model: "XPA 1004", powerPerChannel: 100, ratedImpedance: 8, channelCount: 4 },
      { model: "XPA 2002", powerPerChannel: 200, ratedImpedance: 8, channelCount: 2 },
      { model: "XPA 2004", powerPerChannel: 200, ratedImpedance: 8, channelCount: 4 },
      { model: "XPA 2003C 70V", powerPerChannel: 200, ratedImpedance: 4, channelCount: 3 },
      { model: "XPA 4002", powerPerChannel: 400, ratedImpedance: 8, channelCount: 2 },
    ],
  },
  qsc: {
    label: "QSC",
    models: [
      { model: "CX-Q 2K4", powerPerChannel: 500, ratedImpedance: 8, channelCount: 4 },
      { model: "CX-Q 4K8", powerPerChannel: 1200, ratedImpedance: 8, channelCount: 8 },
      { model: "SPA2-200", powerPerChannel: 200, ratedImpedance: 4, channelCount: 2 },
      { model: "PLD4.2", powerPerChannel: 300, ratedImpedance: 8, channelCount: 4 },
      { model: "PLD4.3", powerPerChannel: 500, ratedImpedance: 8, channelCount: 4 },
      { model: "PLD4.5", powerPerChannel: 625, ratedImpedance: 8, channelCount: 4 },
      { model: "CXD4.2", powerPerChannel: 300, ratedImpedance: 8, channelCount: 4 },
      { model: "CXD4.3", powerPerChannel: 500, ratedImpedance: 8, channelCount: 4 },
    ],
  },
  jbl: {
    label: "JBL",
    models: [
      { model: "CSA 140Z", powerPerChannel: 40, ratedImpedance: 4, channelCount: 4 },
      { model: "CSA 180Z", powerPerChannel: 80, ratedImpedance: 4, channelCount: 4 },
      { model: "CDi 2|300", powerPerChannel: 300, ratedImpedance: 4, channelCount: 2 },
      { model: "CDi 4|600", powerPerChannel: 600, ratedImpedance: 4, channelCount: 4 },
      { model: "CDi 2|600", powerPerChannel: 600, ratedImpedance: 4, channelCount: 2 },
      { model: "CDi 4|300", powerPerChannel: 300, ratedImpedance: 4, channelCount: 4 },
      { model: "CSA 280Z", powerPerChannel: 80, ratedImpedance: 4, channelCount: 8 },
    ],
  },
  "k-array": {
    label: "K-Array",
    models: [
      { model: "Kommander KA02", powerPerChannel: 100, ratedImpedance: 4, channelCount: 2 },
      { model: "Kommander KA04", powerPerChannel: 200, ratedImpedance: 4, channelCount: 4 },
      { model: "Kommander KA14 I", powerPerChannel: 250, ratedImpedance: 4, channelCount: 4 },
      { model: "Kommander KA18", powerPerChannel: 500, ratedImpedance: 8, channelCount: 8 },
      { model: "Kommander KA28", powerPerChannel: 1000, ratedImpedance: 8, channelCount: 8 },
      { model: "Kommander KA34", powerPerChannel: 1500, ratedImpedance: 8, channelCount: 4 },
      { model: "Kommander KA68", powerPerChannel: 2000, ratedImpedance: 8, channelCount: 8 },
      { model: "Kommander KA104", powerPerChannel: 2500, ratedImpedance: 8, channelCount: 4 },
      { model: "Kommander KA208", powerPerChannel: 5000, ratedImpedance: 8, channelCount: 8 },
      { model: "K-RACK-M-208", powerPerChannel: 5000, ratedImpedance: 8, channelCount: 8 },
    ],
  },
  crestron: {
    label: "Crestron",
    models: [
      { model: "AMP-X300", powerPerChannel: 150, ratedImpedance: 8, channelCount: 2 },
      { model: "AMP-X50MP", powerPerChannel: 50, ratedImpedance: 4, channelCount: 4 },
      { model: "CNAMPX-16X60", powerPerChannel: 60, ratedImpedance: 8, channelCount: 16 },
      { model: "AMP-3210T", powerPerChannel: 210, ratedImpedance: 4, channelCount: 2 },
      { model: "AMP-2210T", powerPerChannel: 120, ratedImpedance: 4, channelCount: 2 },
      { model: "AMP-X150", powerPerChannel: 75, ratedImpedance: 8, channelCount: 2 },
    ],
  },
  crown: {
    label: "Crown",
    models: [
      { model: "DCi 2|300", powerPerChannel: 300, ratedImpedance: 4, channelCount: 2 },
      { model: "DCi 4|600", powerPerChannel: 600, ratedImpedance: 4, channelCount: 4 },
      { model: "XLS 1002", powerPerChannel: 350, ratedImpedance: 4, channelCount: 2 },
      { model: "XLS 1502", powerPerChannel: 525, ratedImpedance: 4, channelCount: 2 },
      { model: "XLS 2002", powerPerChannel: 650, ratedImpedance: 4, channelCount: 2 },
      { model: "XLS 2502", powerPerChannel: 775, ratedImpedance: 4, channelCount: 2 },
      { model: "DCi 8|300", powerPerChannel: 300, ratedImpedance: 4, channelCount: 8 },
    ],
  },
};

const SPEAKER_CATALOG = {
  extron: {
    label: "Extron",
    models: [
      { model: "SF 26CT", impedance: 8, wattage: 30 },
      { model: "SM 26", impedance: 8, wattage: 50 },
      { model: "SF 3C LP", impedance: 8, wattage: 16 },
      { model: "SM 28", impedance: 8, wattage: 100 },
      { model: "SM 3", impedance: 8, wattage: 25 },
      { model: "SM 5", impedance: 8, wattage: 50 },
      { model: "SM 6", impedance: 8, wattage: 60 },
      { model: "SI 26", impedance: 8, wattage: 100 },
    ],
  },
  qsc: {
    label: "QSC",
    models: [
      { model: "AD-S6T", impedance: 8, wattage: 150 },
      { model: "AD-C6T", impedance: 8, wattage: 30 },
      { model: "AC-S4T", impedance: 8, wattage: 30 },
      { model: "AD-P6T", impedance: 8, wattage: 60 },
      { model: "AD-S8T", impedance: 8, wattage: 250 },
      { model: "AD-C8T", impedance: 8, wattage: 60 },
      { model: "AD-S12", impedance: 8, wattage: 400 },
      { model: "AD-S282H", impedance: 8, wattage: 500 },
    ],
  },
  jbl: {
    label: "JBL",
    models: [
      { model: "Control 25-1", impedance: 8, wattage: 200 },
      { model: "Control 16C/T", impedance: 8, wattage: 60 },
      { model: "Control 26CT", impedance: 8, wattage: 150 },
      { model: "Control 28-1", impedance: 8, wattage: 175 },
      { model: "Control 23-1", impedance: 8, wattage: 100 },
      { model: "Control 24C/T", impedance: 8, wattage: 120 },
      { model: "Control 47C/T", impedance: 8, wattage: 150 },
      { model: "AC16", impedance: 8, wattage: 150 },
    ],
  },
  "k-array": {
    label: "K-Array",
    models: [
      { model: "Lyzard KZ1 I", impedanceOptions: [32], wattage: 10 },
      { model: "Lyzard KZ14 I", impedanceOptions: [16], wattage: 100 },
      { model: "Vyper KV25 II", impedanceOptions: [8, 16], wattage: 200 },
      { model: "Vyper KV52 II", impedanceOptions: [8, 16], wattage: 400 },
      { model: "Vyper KV102 II", impedanceOptions: [8], wattage: 800 },
      { model: "Kobra KK52 I", impedanceOptions: [16], wattage: 500 },
      { model: "Kobra KK102 I", impedanceOptions: [8], wattage: 1000 },
      { model: "Python KP52 I", impedanceOptions: [16], wattage: 600 },
      { model: "Python KP102 I", impedanceOptions: [8], wattage: 1200 },
      { model: "Kayman KY52", impedanceOptions: [16], wattage: 500 },
      { model: "Kayman KY102", impedanceOptions: [8], wattage: 1000 },
      { model: "Domino KF26", impedanceOptions: [16], wattage: 1000 },
      { model: "Domino KFC26", impedanceOptions: [16], wattage: 1000 },
      { model: "Domino KF210", impedanceOptions: [8], wattage: 2000 },
      { model: "Domino KF212", impedanceOptions: [8], wattage: 2400 },
      { model: "Tornado KT2", impedanceOptions: [16, 32], wattage: 150 },
      { model: "Tornado KT2C", impedanceOptions: [16, 32], wattage: 150 },
      { model: "Tornado KT4", impedanceOptions: [16], wattage: 300 },
      { model: "Tornado KT6", impedanceOptions: [8, 16], wattage: 500 },
      { model: "Anakonda KAN200", impedanceOptions: [8], wattage: 900 },
      { model: "Anakonda KAN200+", impedanceOptions: [8], wattage: 900 },
      { model: "Anakonda KAN200+8", impedanceOptions: [8], wattage: 900 },
      { model: "Koral KO70", impedanceOptions: [8], wattage: 300 },
      { model: "Koral KO102", impedanceOptions: [8], wattage: 800 },
    ],
  },
  crestron: {
    label: "Crestron",
    models: [
      { model: "SAROS IC6T-W-T-EACH", impedance: 8, wattage: 60 },
      { model: "SAROS IC8T-W-T-EACH", impedance: 8, wattage: 100 },
      { model: "SAROS PD6T-B-T-EACH", impedance: 8, wattage: 60 },
      { model: "SAROS IC4T-W-T-EACH", impedance: 8, wattage: 30 },
      { model: "SAROS IC6-W-T-EACH", impedance: 8, wattage: 60 },
      { model: "SAROS IC8-W-T-EACH", impedance: 8, wattage: 100 },
      { model: "SAROS LBP-6T-B-T-EACH", impedance: 8, wattage: 60 },
    ],
  },
  crown: {
    label: "Crown",
    models: [
      { model: "CTs 2-way reference speaker", impedance: 8, wattage: 100 },
      { model: "ComTech wall speaker", impedance: 8, wattage: 60 },
      { model: "CDi install speaker", impedance: 8, wattage: 120 },
      { model: "DriveCore monitor speaker", impedance: 8, wattage: 150 },
      { model: "DCi demo monitor", impedance: 8, wattage: 200 },
      { model: "XLS install speaker", impedance: 8, wattage: 250 },
    ],
  },
};

const DEFAULTS = {
  projectName: "",
  ampName: "",
  ampBrand: "extron",
  ampModelSelect: "0",
  powerPerChannel: "200",
  ratedImpedance: "4",
  channelCount: "2",
  speakerBrand: "extron",
  speakerModelSelect: "0",
  speakerImpedanceVariant: "",
  speakerCount: "4",
  speakerImpedance: "8",
  speakerWattage: "30",
};

const elements = {
  projectName: document.querySelector("#project-name"),
  ampName: document.querySelector("#amp-name"),
  ampBrand: document.querySelector("#amp-brand"),
  ampModelSelect: document.querySelector("#amp-model-select"),
  ampModelGroup: document.querySelector("#amp-model-group"),
  powerPerChannel: document.querySelector("#power-per-channel"),
  ratedImpedance: document.querySelector("#rated-impedance"),
  channelCount: document.querySelector("#channel-count"),
  speakerBrand: document.querySelector("#speaker-brand"),
  speakerModelSelect: document.querySelector("#speaker-model-select"),
  speakerModelGroup: document.querySelector("#speaker-model-group"),
  speakerImpedanceVariant: document.querySelector("#speaker-impedance-variant"),
  speakerImpedanceVariantGroup: document.querySelector("#speaker-impedance-variant-group"),
  speakerCount: document.querySelector("#speaker-count"),
  speakerImpedance: document.querySelector("#speaker-impedance"),
  speakerWattage: document.querySelector("#speaker-wattage"),
  exportCsv: document.querySelector("#export-csv"),
  resetForm: document.querySelector("#reset-form"),
  summaryGrid: document.querySelector("#summary-grid"),
  recommendation: document.querySelector("#recommendation"),
  channelResults: document.querySelector("#channel-results"),
};

function formatOhms(value) {
  return `${value.toFixed(value < 10 ? 2 : 1).replace(/\.0$/, "")} ohms`;
}

function formatWatts(value) {
  return `${Math.round(value)} W`;
}

function formatPercent(value) {
  return `${(value * 100).toFixed(0)}%`;
}

function getTrafficStatus(utilization, impedanceSafe) {
  if (!impedanceSafe || utilization > 1) {
    return "red";
  }

  if (utilization >= 0.9) {
    return "yellow";
  }

  return "green";
}

function trafficLabel(status) {
  if (status === "green") return "Green";
  if (status === "yellow") return "Yellow";
  return "Red";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function loadDraft() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Failed to load Speaker Load Planner draft", error);
    return null;
  }
}

function saveDraft() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(getInputState()));
}

function getInputState() {
  return {
    projectName: elements.projectName.value,
    ampName: elements.ampName.value,
    ampBrand: elements.ampBrand.value,
    ampModelSelect: elements.ampModelSelect.value,
    powerPerChannel: elements.powerPerChannel.value,
    ratedImpedance: elements.ratedImpedance.value,
    channelCount: elements.channelCount.value,
    speakerBrand: elements.speakerBrand.value,
    speakerModelSelect: elements.speakerModelSelect.value,
    speakerImpedanceVariant: elements.speakerImpedanceVariant.value,
    speakerCount: elements.speakerCount.value,
    speakerImpedance: elements.speakerImpedance.value,
    speakerWattage: elements.speakerWattage.value,
  };
}

function getCatalogModel(catalog, brand, indexValue) {
  const brandCatalog = catalog[brand];
  if (!brandCatalog) {
    return null;
  }
  return brandCatalog.models[Number.parseInt(indexValue, 10) || 0] || null;
}

function renderCatalogOptions(selectElement, catalog, brand) {
  const brandCatalog = catalog[brand];
  if (!brandCatalog) {
    selectElement.innerHTML = '<option value="">Manual entry</option>';
    selectElement.disabled = true;
    return;
  }

  selectElement.innerHTML = brandCatalog.models
    .map((item, index) => `<option value="${index}">${item.model}</option>`)
    .join("");
  selectElement.disabled = false;
}

function applyAmpModel() {
  const selectedModel = getCatalogModel(AMP_CATALOG, elements.ampBrand.value, elements.ampModelSelect.value);
  if (!selectedModel) {
    return;
  }

  elements.ampName.value = selectedModel.model;
  elements.powerPerChannel.value = String(selectedModel.powerPerChannel);
  elements.ratedImpedance.value = String(selectedModel.ratedImpedance);
  elements.channelCount.value = String(selectedModel.channelCount);
}

function applySpeakerModel() {
  const selectedModel = getCatalogModel(SPEAKER_CATALOG, elements.speakerBrand.value, elements.speakerModelSelect.value);
  if (!selectedModel) {
    return;
  }

  const impedanceOptions = selectedModel.impedanceOptions || (selectedModel.impedance ? [selectedModel.impedance] : []);
  if (impedanceOptions.length > 1) {
    elements.speakerImpedanceVariantGroup.hidden = false;
    elements.speakerImpedanceVariant.innerHTML = impedanceOptions
      .map((value) => `<option value="${value}">${value} ohms</option>`)
      .join("");
    if (!impedanceOptions.map(String).includes(elements.speakerImpedanceVariant.value)) {
      elements.speakerImpedanceVariant.value = String(impedanceOptions[0]);
    }
    elements.speakerImpedance.value = elements.speakerImpedanceVariant.value;
    elements.speakerImpedance.readOnly = true;
  } else {
    elements.speakerImpedanceVariantGroup.hidden = true;
    elements.speakerImpedanceVariant.innerHTML = "";
    elements.speakerImpedanceVariant.value = impedanceOptions.length ? String(impedanceOptions[0]) : "";
    elements.speakerImpedance.value = impedanceOptions.length ? String(impedanceOptions[0]) : "";
    elements.speakerImpedance.readOnly = elements.speakerBrand.value !== "custom";
  }
  elements.speakerWattage.value = String(selectedModel.wattage);
}

function syncCatalogMode() {
  const ampIsManual = elements.ampBrand.value === "custom";
  const speakerIsManual = elements.speakerBrand.value === "custom";

  elements.ampModelGroup.hidden = ampIsManual;
  elements.speakerModelGroup.hidden = speakerIsManual;
  elements.ampName.readOnly = !ampIsManual;
  elements.speakerImpedance.readOnly = !speakerIsManual;

  if (!ampIsManual) {
    applyAmpModel();
  }

  if (!speakerIsManual) {
    applySpeakerModel();
  } else {
    elements.speakerImpedanceVariantGroup.hidden = true;
    elements.speakerImpedanceVariant.innerHTML = "";
  }
}

function restoreDraft() {
  const draft = loadDraft();
  const source = draft || DEFAULTS;

  Object.entries(source).forEach(([key, value]) => {
    if (elements[key]) {
      elements[key].value = value ?? "";
    }
  });
}

function getInputs() {
  const ampModel = getCatalogModel(AMP_CATALOG, elements.ampBrand.value, elements.ampModelSelect.value);
  const speakerModel = getCatalogModel(SPEAKER_CATALOG, elements.speakerBrand.value, elements.speakerModelSelect.value);
  const selectedSpeakerImpedance = elements.speakerImpedanceVariant.value || elements.speakerImpedance.value;

  return {
    projectName: elements.projectName.value.trim(),
    ampName: elements.ampName.value.trim(),
    ampBrand: elements.ampBrand.value,
    ampModelName: ampModel?.model || "",
    powerPerChannel: Math.max(0, Number.parseFloat(elements.powerPerChannel.value) || 0),
    ratedImpedance: Math.max(0, Number.parseFloat(elements.ratedImpedance.value) || 0),
    channelCount: Math.max(1, Number.parseInt(elements.channelCount.value, 10) || 1),
    speakerBrand: elements.speakerBrand.value,
    speakerModelName: speakerModel?.model || "",
    speakerCount: Math.max(1, Number.parseInt(elements.speakerCount.value, 10) || 1),
    speakerImpedance: Math.max(0, Number.parseFloat(selectedSpeakerImpedance) || 0),
    speakerWattage: Math.max(0, Number.parseFloat(elements.speakerWattage.value) || 0),
  };
}

function calculateParallelImpedance(values) {
  if (!values.length || values.some((value) => value <= 0)) {
    return Infinity;
  }

  return 1 / values.reduce((sum, value) => sum + 1 / value, 0);
}

function estimateAmpPowerAtLoad(powerPerChannel, ratedImpedance, actualImpedance) {
  if (powerPerChannel <= 0 || ratedImpedance <= 0 || actualImpedance <= 0) {
    return 0;
  }

  const voltage = Math.sqrt(powerPerChannel * ratedImpedance);
  return (voltage * voltage) / actualImpedance;
}

function getIdealDistribution(totalSpeakers, channelCount) {
  const baseCount = Math.floor(totalSpeakers / channelCount);
  const remainder = totalSpeakers % channelCount;
  return Array.from({ length: channelCount }, (_, index) => (index < remainder ? baseCount + 1 : baseCount));
}

function calculateDistributionPenalty(distribution, channelCount, totalSpeakers) {
  const expected = getIdealDistribution(totalSpeakers, channelCount).sort((left, right) => right - left);
  const actual = distribution.slice().sort((left, right) => right - left);
  return actual.reduce((sum, count, index) => sum + Math.abs(count - (expected[index] || 0)), 0);
}

function buildSequentialSpeakerLabels(count, prefix = "S") {
  return Array.from({ length: count }, (_, index) => `${prefix}${index + 1}`);
}

function chunkLabels(labels, groupCount) {
  if (groupCount <= 0 || labels.length % groupCount !== 0) {
    return null;
  }

  const groupSize = labels.length / groupCount;
  const groups = [];
  for (let index = 0; index < labels.length; index += groupSize) {
    groups.push(labels.slice(index, index + groupSize));
  }
  return groups;
}

function buildWiringDiagram(name, groups, topology) {
  if (topology === "parallel") {
    return [
      name,
      `Tie all speaker + cores together: ${groups[0].join(", ")}`,
      `Tie all speaker - cores together: ${groups[0].join(", ")}`,
      "Common + to Amp +, common - to Amp -.",
    ].join("\n");
  }

  if (topology === "series") {
    return [
      name,
      `Chain the speakers in order: ${groups[0].join(" -> ")}`,
      "Amp + to first speaker +, each speaker - to next speaker +, final speaker - back to Amp -.",
    ].join("\n");
  }

  if (topology === "series-parallel") {
    const lines = [name];
    lines.push("Create series branches, then parallel those branches at the amp.");
    groups.forEach((group, index) => {
      lines.push(`Branch ${index + 1}: ${group.join(" + -> - ")}`);
    });
    lines.push("Common all branch starts to Amp + and all branch ends to Amp -.");
    return lines.join("\n");
  }

  const lines = [name];
  lines.push("Create parallel speaker groups, then place those groups in series.");
  groups.forEach((group, index) => {
    lines.push(`Group ${index + 1}: tie + together and tie - together for ${group.join(", ")}`);
  });
  lines.push("Amp + to Group 1 +, each group output to next group input, final group - back to Amp -.");
  return lines.join("\n");
}

function buildPlanForCount(speakerCount, speakerImpedance, ratedImpedance, powerPerChannel, speakerWattage) {
  if (speakerCount <= 0 || speakerImpedance <= 0 || ratedImpedance <= 0 || powerPerChannel <= 0) {
    return null;
  }

  const labels = buildSequentialSpeakerLabels(speakerCount);
  const candidates = [];

  candidates.push({
    name: "All Parallel",
    totalImpedance: speakerImpedance / speakerCount,
    diagram: buildWiringDiagram("All Parallel", [labels], "parallel"),
  });

  candidates.push({
    name: "All Series",
    totalImpedance: speakerImpedance * speakerCount,
    diagram: buildWiringDiagram("All Series", [labels], "series"),
  });

  for (let groupCount = 2; groupCount <= Math.floor(speakerCount / 2); groupCount += 1) {
    if (speakerCount % groupCount !== 0) {
      continue;
    }

    const groups = chunkLabels(labels, groupCount);
    const groupSize = speakerCount / groupCount;
    if (!groups || groupSize < 2) {
      continue;
    }

    const seriesBranchImpedance = speakerImpedance * groupSize;
    candidates.push({
      name: `${groupCount} series branches in parallel`,
      totalImpedance: calculateParallelImpedance(Array.from({ length: groupCount }, () => seriesBranchImpedance)),
      diagram: buildWiringDiagram(`${groupCount} series branches in parallel`, groups, "series-parallel"),
    });

    const parallelGroupImpedance = speakerImpedance / groupSize;
    candidates.push({
      name: `${groupCount} parallel groups in series`,
      totalImpedance: Array.from({ length: groupCount }, () => parallelGroupImpedance).reduce((sum, value) => sum + value, 0),
      diagram: buildWiringDiagram(`${groupCount} parallel groups in series`, groups, "parallel-series"),
    });
  }

  const totalSpeakerPower = speakerCount * speakerWattage;
  const ranked = candidates.map((candidate) => {
    const impedanceSafe = candidate.totalImpedance >= ratedImpedance;
    const projectedAmpOutput = estimateAmpPowerAtLoad(powerPerChannel, ratedImpedance, candidate.totalImpedance);
    const ampOutputExceeded = projectedAmpOutput > powerPerChannel;
    const availableAmpOutput = impedanceSafe ? Math.min(projectedAmpOutput, powerPerChannel) : 0;
    const utilization = availableAmpOutput > 0 ? totalSpeakerPower / availableAmpOutput : Infinity;
    const powerSafe = utilization <= 1;
    const powerGap = Math.abs(availableAmpOutput - totalSpeakerPower);
    const impedanceRatio = ratedImpedance > 0 ? candidate.totalImpedance / ratedImpedance : Infinity;
    const impedanceMatchPenalty = Math.abs(Math.log2(impedanceRatio));

    return {
      ...candidate,
      safe: impedanceSafe && powerSafe && !ampOutputExceeded,
      impedanceSafe,
      ampOutputExceeded,
      powerSafe,
      viable: impedanceSafe && powerSafe && !ampOutputExceeded,
      projectedAmpOutput,
      estimatedAmpOutput: availableAmpOutput,
      availableAmpOutput,
      totalSpeakerPower,
      utilization,
      powerGap,
      delta: Math.abs(candidate.totalImpedance - ratedImpedance),
      impedanceMatchPenalty,
      status: getTrafficStatus(utilization, impedanceSafe),
    };
  }).filter((candidate) => Number.isFinite(candidate.totalImpedance) && candidate.totalImpedance > 0);

  ranked.sort((left, right) => {
    if (left.viable !== right.viable) {
      return left.viable ? -1 : 1;
    }
    if (left.ampOutputExceeded !== right.ampOutputExceeded) {
      return left.ampOutputExceeded ? 1 : -1;
    }
    if (left.status !== right.status) {
      const order = { green: 0, yellow: 1, red: 2 };
      return order[left.status] - order[right.status];
    }
    if (left.powerSafe !== right.powerSafe) {
      return left.powerSafe ? -1 : 1;
    }
    if (left.delta !== right.delta) {
      return left.delta - right.delta;
    }
    if (left.powerGap !== right.powerGap) {
      return left.powerGap - right.powerGap;
    }
    if (left.impedanceMatchPenalty !== right.impedanceMatchPenalty) {
      return left.impedanceMatchPenalty - right.impedanceMatchPenalty;
    }
    if (left.utilization !== right.utilization) {
      return Math.abs(1 - left.utilization) - Math.abs(1 - right.utilization);
    }
    return left.totalImpedance - right.totalImpedance;
  });

  return ranked[0] || null;
}

function generateDistributions(totalSpeakers, channelCount) {
  const results = [];

  function walk(remaining, slotsLeft, maxAllowed, current) {
    if (slotsLeft === 0) {
      if (remaining === 0) {
        results.push(current.slice());
      }
      return;
    }

    const nextMax = Math.min(maxAllowed, remaining);
    for (let count = nextMax; count >= 0; count -= 1) {
      current.push(count);
      walk(remaining - count, slotsLeft - 1, count, current);
      current.pop();
    }
  }

  walk(totalSpeakers, channelCount, totalSpeakers, []);
  return results;
}

function scoreDistribution(distribution, ratedImpedance, speakerImpedance, powerPerChannel, speakerWattage) {
  const channelPlans = distribution.map((count, index) => {
    if (count === 0) {
      return {
        channelNumber: index + 1,
        speakerCount: 0,
        idle: true,
      };
    }

    const plan = buildPlanForCount(count, speakerImpedance, ratedImpedance, powerPerChannel, speakerWattage);
    const totalSpeakerPower = plan?.totalSpeakerPower ?? count * speakerWattage;
    const estimatedAmpOutput = plan?.estimatedAmpOutput ?? 0;
    const utilization = plan?.utilization ?? Infinity;
    const impedanceSafe = Boolean(plan?.impedanceSafe);
    const powerSafe = Boolean(plan?.powerSafe);
    const ampOutputExceeded = Boolean(plan?.ampOutputExceeded);
    const viable = impedanceSafe && powerSafe && !ampOutputExceeded;
    const status = plan?.status || getTrafficStatus(utilization, impedanceSafe);

    return {
      channelNumber: index + 1,
      speakerCount: count,
      idle: false,
      ...plan,
      totalSpeakerPower,
      estimatedAmpOutput,
      projectedAmpOutput: plan?.projectedAmpOutput ?? estimatedAmpOutput,
      utilization,
      impedanceSafe,
      powerSafe,
      ampOutputExceeded,
      viable,
      status,
    };
  });

  const activeChannels = channelPlans.filter((channel) => !channel.idle);
  const viableChannels = activeChannels.filter((channel) => channel.viable).length;
  const allViable = activeChannels.length > 0 && viableChannels === activeChannels.length;
  const deltaSum = activeChannels.reduce((sum, channel) => sum + (channel.delta || 0), 0);
  const utilizationPenalty = activeChannels.reduce((sum, channel) => sum + Math.abs(1 - channel.utilization), 0);
  const powerGapPenalty = activeChannels.reduce((sum, channel) => sum + (channel.powerGap || 0), 0);
  const counts = activeChannels.map((channel) => channel.speakerCount);
  const imbalance = counts.length ? Math.max(...counts) - Math.min(...counts) : 0;
  const averageSpeakers = activeChannels.length
    ? distribution.reduce((sum, count) => sum + count, 0) / activeChannels.length
    : 0;
  const spreadPenalty = counts.reduce((sum, count) => sum + Math.abs(count - averageSpeakers), 0);
  const balancePenalty = calculateDistributionPenalty(distribution, distribution.length, distribution.reduce((sum, count) => sum + count, 0));
  const maxSpeakersOnChannel = counts.length ? Math.max(...counts) : 0;
  const redChannels = activeChannels.filter((channel) => channel.status === "red").length;
  const yellowChannels = activeChannels.filter((channel) => channel.status === "yellow").length;
  const greenChannels = activeChannels.filter((channel) => channel.status === "green").length;
  const ampOutputExceededChannels = activeChannels.filter((channel) => channel.ampOutputExceeded).length;
  const powerUnsafeChannels = activeChannels.filter((channel) => !channel.powerSafe).length;
  const impedanceUnsafeChannels = activeChannels.filter((channel) => !channel.impedanceSafe).length;

  return {
    distribution,
    channelPlans,
    allViable,
    viableChannels,
    activeChannels: activeChannels.length,
    deltaSum,
    utilizationPenalty,
    powerGapPenalty,
    imbalance,
    spreadPenalty,
    balancePenalty,
    maxSpeakersOnChannel,
    redChannels,
    yellowChannels,
    greenChannels,
    ampOutputExceededChannels,
    powerUnsafeChannels,
    impedanceUnsafeChannels,
  };
}

function calculateRecommendation(inputs) {
  if (!inputs.powerPerChannel || !inputs.ratedImpedance || !inputs.channelCount || !inputs.speakerCount || !inputs.speakerImpedance) {
    return null;
  }

  const distributions = generateDistributions(inputs.speakerCount, inputs.channelCount);
  const scored = distributions.map((distribution) =>
    scoreDistribution(distribution, inputs.ratedImpedance, inputs.speakerImpedance, inputs.powerPerChannel, inputs.speakerWattage),
  );

  scored.sort((left, right) => {
    if (left.allViable !== right.allViable) {
      return left.allViable ? -1 : 1;
    }
    if (left.redChannels !== right.redChannels) {
      return left.redChannels - right.redChannels;
    }
    if (left.ampOutputExceededChannels !== right.ampOutputExceededChannels) {
      return left.ampOutputExceededChannels - right.ampOutputExceededChannels;
    }
    if (left.powerUnsafeChannels !== right.powerUnsafeChannels) {
      return left.powerUnsafeChannels - right.powerUnsafeChannels;
    }
    if (left.impedanceUnsafeChannels !== right.impedanceUnsafeChannels) {
      return left.impedanceUnsafeChannels - right.impedanceUnsafeChannels;
    }
    if (left.viableChannels !== right.viableChannels) {
      return right.viableChannels - left.viableChannels;
    }
    if (left.balancePenalty !== right.balancePenalty) {
      return left.balancePenalty - right.balancePenalty;
    }
    if (left.yellowChannels !== right.yellowChannels) {
      return left.yellowChannels - right.yellowChannels;
    }
    if (left.imbalance !== right.imbalance) {
      return left.imbalance - right.imbalance;
    }
    if (left.spreadPenalty !== right.spreadPenalty) {
      return left.spreadPenalty - right.spreadPenalty;
    }
    if (left.utilizationPenalty !== right.utilizationPenalty) {
      return left.utilizationPenalty - right.utilizationPenalty;
    }
    if (left.powerGapPenalty !== right.powerGapPenalty) {
      return left.powerGapPenalty - right.powerGapPenalty;
    }
    if (left.activeChannels !== right.activeChannels) {
      return right.activeChannels - left.activeChannels;
    }
    if (left.maxSpeakersOnChannel !== right.maxSpeakersOnChannel) {
      return left.maxSpeakersOnChannel - right.maxSpeakersOnChannel;
    }
    return left.deltaSum - right.deltaSum;
  });

  return scored[0] || null;
}

function renderSummaryCard(label, value) {
  return `
    <article class="summary-card">
      <p class="mini-label">${escapeHtml(label)}</p>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `;
}

function renderRecommendation(inputs, recommendation) {
  if (!recommendation) {
    elements.summaryGrid.innerHTML = "";
    elements.recommendation.className = "recommendation";
    elements.recommendation.innerHTML = `
      <h3>Enter the amp and speaker values</h3>
      <p class="note">Once the required values are in place, the planner will propose the closest safe speaker split and wiring layout.</p>
    `;
    elements.channelResults.innerHTML = '<div class="empty-state">No channel plan yet.</div>';
    return;
  }

  const totalSpeakerPower = inputs.speakerCount * inputs.speakerWattage;
  const compromise = !recommendation.allViable;

  elements.summaryGrid.innerHTML = [
    renderSummaryCard("Channels Used", `${recommendation.activeChannels} / ${inputs.channelCount}`),
    renderSummaryCard("Speaker Split", recommendation.distribution.filter((count) => count > 0).join(" / ")),
    renderSummaryCard("Viable Channels", `${recommendation.viableChannels} / ${recommendation.activeChannels}`),
    renderSummaryCard("Green / Yellow / Red", `${recommendation.greenChannels} / ${recommendation.yellowChannels} / ${recommendation.redChannels}`),
    renderSummaryCard("Amp Output Flags", `${recommendation.ampOutputExceededChannels}`),
    renderSummaryCard("Total Speaker Power", formatWatts(totalSpeakerPower)),
  ].join("");

  elements.recommendation.className = `recommendation ${compromise ? "compromise" : "safe"}`;
  elements.recommendation.innerHTML = `
    <h3>${compromise ? "Closest Practical Compromise" : "Recommended Safe Distribution"}</h3>
    <p class="note">
      ${
        compromise
          ? "No fully viable split was found across every active channel, so this result is the closest practical compromise once impedance and available amp power are both considered."
          : "This split gives the closest viable impedance and power match while keeping the speaker quantities as balanced as practical."
      }
    </p>
  `;

  const activeChannels = recommendation.channelPlans.filter((channel) => !channel.idle);
  elements.channelResults.innerHTML = activeChannels.map((channel) => `
    <article class="channel-card ${channel.status}">
      <p class="mini-label">Channel ${channel.channelNumber}</p>
      <h3>${channel.speakerCount} speakers</h3>
      <p class="note">${
        channel.viable
          ? `${escapeHtml(channel.name)} is the recommended wiring approach for this channel.`
          : `Closest available wiring is ${escapeHtml(channel.name)}, but this channel is still outside a viable amp/speaker match.`
      }</p>

      <p class="note">${
        channel.ampOutputExceeded
          ? "Warning: this load would force the amplifier beyond its rated per-channel output."
          : channel.powerSafe
            ? "Channel speaker power stays within the available output at this load."
            : "Warning: the speakers on this channel require more power than the amp can supply at this load."
      }</p>

      <div class="traffic-light ${channel.status}">
        <span class="traffic-dot"></span>
        ${trafficLabel(channel.status)}
      </div>

      <div class="channel-meta">
        <div class="meta-box">
          <span>Load</span>
          <strong>${escapeHtml(formatOhms(channel.totalImpedance))}</strong>
        </div>
        <div class="meta-box">
          <span>Estimated Amp Output</span>
          <strong>${escapeHtml(formatWatts(channel.estimatedAmpOutput))}</strong>
        </div>
        <div class="meta-box">
          <span>Speaker Power</span>
          <strong>${escapeHtml(formatWatts(channel.totalSpeakerPower))}</strong>
        </div>
        <div class="meta-box">
          <span>Usage</span>
          <strong>${escapeHtml(formatPercent(channel.utilization))}</strong>
        </div>
      </div>

      <pre class="wiring-diagram">${escapeHtml(channel.diagram)}</pre>
    </article>
  `).join("");
}

function downloadCsv(fileName, csv) {
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

function exportCsv() {
  const inputs = getInputs();
  const recommendation = calculateRecommendation(inputs);
  if (!recommendation) {
    return;
  }

  const ampBrandLabel = AMP_CATALOG[inputs.ampBrand]?.label || "Custom / Manual Entry";
  const speakerBrandLabel = SPEAKER_CATALOG[inputs.speakerBrand]?.label || "Custom / Manual Entry";

  const rows = [[
    "Project Name",
    "Amp Brand",
    "Amp Name",
    "Amp Model",
    "Power Per Channel W",
    "Rated Channel Impedance Ohms",
    "Channel Count",
    "Speaker Brand",
    "Speaker Model",
    "Total Speakers",
    "Speaker Impedance Ohms",
    "Speaker Power W",
    "Channel",
    "Speakers On Channel",
    "Recommended Wiring",
    "Load",
    "Estimated Amp Output W",
    "Speaker Power On Channel W",
    "Usage Percent",
    "Safe",
    "Wiring Diagram",
  ]];

  recommendation.channelPlans.filter((channel) => !channel.idle).forEach((channel) => {
    rows.push([
      inputs.projectName,
      ampBrandLabel,
      inputs.ampName,
      inputs.ampModelName,
      inputs.powerPerChannel,
      inputs.ratedImpedance,
      inputs.channelCount,
      speakerBrandLabel,
      inputs.speakerModelName,
      inputs.speakerCount,
      inputs.speakerImpedance,
      inputs.speakerWattage,
      `Channel ${channel.channelNumber}`,
      channel.speakerCount,
      channel.name,
      formatOhms(channel.totalImpedance),
      Math.round(channel.estimatedAmpOutput),
      Math.round(channel.totalSpeakerPower),
      formatPercent(channel.utilization),
      channel.viable ? "Yes" : "No",
      channel.diagram,
    ]);
  });

  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\r\n");
  const fileStem = (inputs.projectName || inputs.ampName || inputs.ampModelName || "speaker_load_planner")
    .replace(/[<>:"/\\|?*]+/g, "_")
    .replace(/\s+/g, "_");
  downloadCsv(`${fileStem}.csv`, csv);
}

function resetForm() {
  Object.entries(DEFAULTS).forEach(([key, value]) => {
    if (elements[key]) {
      elements[key].value = value;
    }
  });
  renderCatalogOptions(elements.ampModelSelect, AMP_CATALOG, elements.ampBrand.value);
  renderCatalogOptions(elements.speakerModelSelect, SPEAKER_CATALOG, elements.speakerBrand.value);
  syncCatalogMode();
  updatePlanner();
}

function updatePlanner() {
  const inputs = getInputs();
  const recommendation = calculateRecommendation(inputs);
  renderRecommendation(inputs, recommendation);
  saveDraft();
}

elements.ampBrand.addEventListener("change", () => {
  renderCatalogOptions(elements.ampModelSelect, AMP_CATALOG, elements.ampBrand.value);
  elements.ampModelSelect.value = "0";
  syncCatalogMode();
  updatePlanner();
});

elements.ampModelSelect.addEventListener("change", () => {
  applyAmpModel();
  updatePlanner();
});

elements.speakerBrand.addEventListener("change", () => {
  renderCatalogOptions(elements.speakerModelSelect, SPEAKER_CATALOG, elements.speakerBrand.value);
  elements.speakerModelSelect.value = "0";
  syncCatalogMode();
  updatePlanner();
});

elements.speakerModelSelect.addEventListener("change", () => {
  applySpeakerModel();
  updatePlanner();
});

elements.speakerImpedanceVariant.addEventListener("change", () => {
  elements.speakerImpedance.value = elements.speakerImpedanceVariant.value;
  updatePlanner();
});

[elements.projectName, elements.ampName, elements.powerPerChannel, elements.ratedImpedance, elements.channelCount, elements.speakerCount, elements.speakerImpedance, elements.speakerWattage]
  .forEach((input) => {
    input.addEventListener("input", updatePlanner);
    input.addEventListener("change", updatePlanner);
  });

elements.exportCsv.addEventListener("click", exportCsv);
elements.resetForm.addEventListener("click", resetForm);

restoreDraft();
const restoredAmpModel = elements.ampModelSelect.value || DEFAULTS.ampModelSelect;
const restoredSpeakerModel = elements.speakerModelSelect.value || DEFAULTS.speakerModelSelect;
const restoredSpeakerImpedanceVariant = elements.speakerImpedanceVariant.value || DEFAULTS.speakerImpedanceVariant;
renderCatalogOptions(elements.ampModelSelect, AMP_CATALOG, elements.ampBrand.value);
renderCatalogOptions(elements.speakerModelSelect, SPEAKER_CATALOG, elements.speakerBrand.value);
elements.ampModelSelect.value = restoredAmpModel;
elements.speakerModelSelect.value = restoredSpeakerModel;
syncCatalogMode();
if (!elements.speakerImpedanceVariantGroup.hidden && restoredSpeakerImpedanceVariant) {
  elements.speakerImpedanceVariant.value = restoredSpeakerImpedanceVariant;
  elements.speakerImpedance.value = restoredSpeakerImpedanceVariant;
}
updatePlanner();
