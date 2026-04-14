const STORAGE_KEY = "speaker-load-planner-v1";

const elements = {
  projectName: document.querySelector("#project-name"),
  ampName: document.querySelector("#amp-name"),
  powerPerChannel: document.querySelector("#power-per-channel"),
  ratedImpedance: document.querySelector("#rated-impedance"),
  channelCount: document.querySelector("#channel-count"),
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
    powerPerChannel: elements.powerPerChannel.value,
    ratedImpedance: elements.ratedImpedance.value,
    channelCount: elements.channelCount.value,
    speakerCount: elements.speakerCount.value,
    speakerImpedance: elements.speakerImpedance.value,
    speakerWattage: elements.speakerWattage.value,
  };
}

function restoreDraft() {
  const draft = loadDraft();
  if (!draft) {
    return;
  }

  Object.entries(draft).forEach(([key, value]) => {
    if (elements[key]) {
      elements[key].value = value ?? "";
    }
  });
}

function getInputs() {
  return {
    projectName: elements.projectName.value.trim(),
    ampName: elements.ampName.value.trim(),
    powerPerChannel: Math.max(0, Number.parseFloat(elements.powerPerChannel.value) || 0),
    ratedImpedance: Math.max(0, Number.parseFloat(elements.ratedImpedance.value) || 0),
    channelCount: Math.max(1, Number.parseInt(elements.channelCount.value, 10) || 1),
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

  return {
    distribution,
    channelPlans,
    allSafe,
    safeChannels,
    activeChannels: activeChannels.length,
    deltaSum,
    imbalance,
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
    if (left.deltaSum !== right.deltaSum) {
      return left.deltaSum - right.deltaSum;
    }
    if (left.imbalance !== right.imbalance) {
      return left.imbalance - right.imbalance;
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

  const rows = [[
    "Project Name",
    "Amp Name",
    "Power Per Channel W",
    "Rated Channel Impedance Ohms",
    "Channel Count",
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
      inputs.ampName,
      inputs.powerPerChannel,
      inputs.ratedImpedance,
      inputs.channelCount,
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
  const fileStem = (inputs.projectName || inputs.ampName || "speaker_load_planner")
    .replace(/[<>:"/\\|?*]+/g, "_")
    .replace(/\s+/g, "_");
  downloadCsv(`${fileStem}.csv`, csv);
}

function resetForm() {
  elements.projectName.value = "";
  elements.ampName.value = "";
  elements.powerPerChannel.value = "250";
  elements.ratedImpedance.value = "4";
  elements.channelCount.value = "2";
  elements.speakerCount.value = "4";
  elements.speakerImpedance.value = "8";
  elements.speakerWattage.value = "60";
  updatePlanner();
}

function updatePlanner() {
  const inputs = getInputs();
  const recommendation = calculateRecommendation(inputs);
  renderRecommendation(inputs, recommendation);
  saveDraft();
}

[elements.projectName, elements.ampName, elements.powerPerChannel, elements.ratedImpedance, elements.channelCount, elements.speakerCount, elements.speakerImpedance, elements.speakerWattage]
  .forEach((input) => {
    input.addEventListener("input", updatePlanner);
    input.addEventListener("change", updatePlanner);
  });

elements.exportCsv.addEventListener("click", exportCsv);
elements.resetForm.addEventListener("click", resetForm);

restoreDraft();
updatePlanner();
