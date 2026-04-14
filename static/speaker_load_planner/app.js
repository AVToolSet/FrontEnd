const STORAGE_KEY = "speaker-load-planner-v2";

const AMP_CATALOG = {
  extron: {
    label: "Extron",
    models: [
      { model: "XPA U 2002", powerPerChannel: 200, ratedImpedance: 4, channelCount: 2 },
      { model: "XPA U 2004", powerPerChannel: 200, ratedImpedance: 4, channelCount: 4 },
      { model: "XPA 1002", powerPerChannel: 100, ratedImpedance: 8, channelCount: 2 },
      { model: "XPA 2003C 70V", powerPerChannel: 200, ratedImpedance: 4, channelCount: 3 },
    ],
  },
  qsc: {
    label: "QSC",
    models: [
      { model: "CX-Q 2K4", powerPerChannel: 500, ratedImpedance: 8, channelCount: 4 },
      { model: "CX-Q 4K8", powerPerChannel: 1200, ratedImpedance: 8, channelCount: 8 },
      { model: "SPA2-200", powerPerChannel: 200, ratedImpedance: 4, channelCount: 2 },
      { model: "PLD4.2", powerPerChannel: 300, ratedImpedance: 8, channelCount: 4 },
    ],
  },
  jbl: {
    label: "JBL",
    models: [
      { model: "CSA 140Z", powerPerChannel: 40, ratedImpedance: 4, channelCount: 4 },
      { model: "CSA 180Z", powerPerChannel: 80, ratedImpedance: 4, channelCount: 4 },
      { model: "CDi 2|300", powerPerChannel: 300, ratedImpedance: 4, channelCount: 2 },
      { model: "CDi 4|600", powerPerChannel: 600, ratedImpedance: 4, channelCount: 4 },
    ],
  },
  crestron: {
    label: "Crestron",
    models: [
      { model: "AMP-X300", powerPerChannel: 150, ratedImpedance: 8, channelCount: 2 },
      { model: "AMP-X50MP", powerPerChannel: 50, ratedImpedance: 4, channelCount: 4 },
      { model: "CNAMPX-16X60", powerPerChannel: 60, ratedImpedance: 8, channelCount: 16 },
      { model: "AMP-3210T", powerPerChannel: 210, ratedImpedance: 4, channelCount: 2 },
    ],
  },
  crown: {
    label: "Crown",
    models: [
      { model: "DCi 2|300", powerPerChannel: 300, ratedImpedance: 4, channelCount: 2 },
      { model: "DCi 4|600", powerPerChannel: 600, ratedImpedance: 4, channelCount: 4 },
      { model: "XLS 1002", powerPerChannel: 350, ratedImpedance: 4, channelCount: 2 },
      { model: "XLS 1502", powerPerChannel: 525, ratedImpedance: 4, channelCount: 2 },
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
    ],
  },
  qsc: {
    label: "QSC",
    models: [
      { model: "AD-S6T", impedance: 8, wattage: 150 },
      { model: "AD-C6T", impedance: 8, wattage: 30 },
      { model: "AC-S4T", impedance: 8, wattage: 30 },
      { model: "AD-P6T", impedance: 8, wattage: 60 },
    ],
  },
  jbl: {
    label: "JBL",
    models: [
      { model: "Control 25-1", impedance: 8, wattage: 200 },
      { model: "Control 16C/T", impedance: 8, wattage: 60 },
      { model: "Control 26CT", impedance: 8, wattage: 150 },
      { model: "Control 28-1", impedance: 8, wattage: 175 },
    ],
  },
  crestron: {
    label: "Crestron",
    models: [
      { model: "SAROS IC6T-W-T-EACH", impedance: 8, wattage: 60 },
      { model: "SAROS IC8T-W-T-EACH", impedance: 8, wattage: 100 },
      { model: "SAROS PD6T-B-T-EACH", impedance: 8, wattage: 60 },
      { model: "SAROS IC4T-W-T-EACH", impedance: 8, wattage: 30 },
    ],
  },
  crown: {
    label: "Crown",
    models: [
      { model: "CTs 2-way reference speaker", impedance: 8, wattage: 100 },
      { model: "ComTech wall speaker", impedance: 8, wattage: 60 },
      { model: "CDi install speaker", impedance: 8, wattage: 120 },
      { model: "DriveCore monitor speaker", impedance: 8, wattage: 150 },
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

  elements.speakerImpedance.value = String(selectedModel.impedance);
  elements.speakerWattage.value = String(selectedModel.wattage);
}

function syncCatalogMode() {
  const ampIsManual = elements.ampBrand.value === "custom";
  const speakerIsManual = elements.speakerBrand.value === "custom";

  elements.ampModelGroup.hidden = ampIsManual;
  elements.speakerModelGroup.hidden = speakerIsManual;
  elements.ampName.readOnly = !ampIsManual;

  if (!ampIsManual) {
    applyAmpModel();
  }

  if (!speakerIsManual) {
    applySpeakerModel();
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
    speakerImpedance: Math.max(0, Number.parseFloat(elements.speakerImpedance.value) || 0),
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

function buildPlanForCount(speakerCount, speakerImpedance, ratedImpedance) {
  if (speakerCount <= 0 || speakerImpedance <= 0 || ratedImpedance <= 0) {
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

  const ranked = candidates.map((candidate) => ({
    ...candidate,
    safe: candidate.totalImpedance >= ratedImpedance,
    delta: Math.abs(candidate.totalImpedance - ratedImpedance),
  })).filter((candidate) => Number.isFinite(candidate.totalImpedance) && candidate.totalImpedance > 0);

  ranked.sort((left, right) => {
    if (left.safe !== right.safe) {
      return left.safe ? -1 : 1;
    }
    if (left.delta !== right.delta) {
      return left.delta - right.delta;
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

    const plan = buildPlanForCount(count, speakerImpedance, ratedImpedance);
    const totalSpeakerPower = count * speakerWattage;
    const estimatedAmpOutput = plan ? estimateAmpPowerAtLoad(powerPerChannel, ratedImpedance, plan.totalImpedance) : 0;
    const utilization = estimatedAmpOutput > 0 ? totalSpeakerPower / estimatedAmpOutput : 0;

    return {
      channelNumber: index + 1,
      speakerCount: count,
      idle: false,
      ...plan,
      totalSpeakerPower,
      estimatedAmpOutput,
      utilization,
    };
  });

  const activeChannels = channelPlans.filter((channel) => !channel.idle);
  const safeChannels = activeChannels.filter((channel) => channel.safe).length;
  const allSafe = activeChannels.length > 0 && safeChannels === activeChannels.length;
  const deltaSum = activeChannels.reduce((sum, channel) => sum + (channel.delta || 0), 0);
  const counts = activeChannels.map((channel) => channel.speakerCount);
  const imbalance = counts.length ? Math.max(...counts) - Math.min(...counts) : 0;
  const averageSpeakers = activeChannels.length
    ? distribution.reduce((sum, count) => sum + count, 0) / activeChannels.length
    : 0;
  const spreadPenalty = counts.reduce((sum, count) => sum + Math.abs(count - averageSpeakers), 0);
  const maxSpeakersOnChannel = counts.length ? Math.max(...counts) : 0;

  return {
    distribution,
    channelPlans,
    allSafe,
    safeChannels,
    activeChannels: activeChannels.length,
    deltaSum,
    imbalance,
    spreadPenalty,
    maxSpeakersOnChannel,
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
    if (left.allSafe !== right.allSafe) {
      return left.allSafe ? -1 : 1;
    }
    if (left.safeChannels !== right.safeChannels) {
      return right.safeChannels - left.safeChannels;
    }
    if (left.imbalance !== right.imbalance) {
      return left.imbalance - right.imbalance;
    }
    if (left.spreadPenalty !== right.spreadPenalty) {
      return left.spreadPenalty - right.spreadPenalty;
    }
    if (left.maxSpeakersOnChannel !== right.maxSpeakersOnChannel) {
      return left.maxSpeakersOnChannel - right.maxSpeakersOnChannel;
    }
    if (left.deltaSum !== right.deltaSum) {
      return left.deltaSum - right.deltaSum;
    }
    return right.activeChannels - left.activeChannels;
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
  const compromise = !recommendation.allSafe;

  elements.summaryGrid.innerHTML = [
    renderSummaryCard("Channels Used", `${recommendation.activeChannels} / ${inputs.channelCount}`),
    renderSummaryCard("Speaker Split", recommendation.distribution.filter((count) => count > 0).join(" / ")),
    renderSummaryCard("Safe Channels", `${recommendation.safeChannels} / ${recommendation.activeChannels}`),
    renderSummaryCard("Total Speaker Power", formatWatts(totalSpeakerPower)),
  ].join("");

  elements.recommendation.className = `recommendation ${compromise ? "compromise" : "safe"}`;
  elements.recommendation.innerHTML = `
    <h3>${compromise ? "Closest Practical Compromise" : "Recommended Safe Distribution"}</h3>
    <p class="note">
      ${
        compromise
          ? "No fully safe split was found across every active channel, so this result is the closest overall impedance match."
          : "This split gives the closest safe impedance match while keeping the speaker quantities as balanced as practical."
      }
    </p>
  `;

  const activeChannels = recommendation.channelPlans.filter((channel) => !channel.idle);
  elements.channelResults.innerHTML = activeChannels.map((channel) => `
    <article class="channel-card ${channel.safe ? "safe" : "compromise"}">
      <p class="mini-label">Channel ${channel.channelNumber}</p>
      <h3>${channel.speakerCount} speakers</h3>
      <p class="note">${escapeHtml(channel.name)} is the recommended wiring approach for this channel.</p>

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
      channel.safe ? "Yes" : "No",
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
renderCatalogOptions(elements.ampModelSelect, AMP_CATALOG, elements.ampBrand.value);
renderCatalogOptions(elements.speakerModelSelect, SPEAKER_CATALOG, elements.speakerBrand.value);
elements.ampModelSelect.value = restoredAmpModel;
elements.speakerModelSelect.value = restoredSpeakerModel;
syncCatalogMode();
updatePlanner();
