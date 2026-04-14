const STORAGE_KEY = "amp-speaker-pairing-calculator-v3";

const projectMeta = document.querySelector("#project-meta");
const summaryGrid = document.querySelector("#summary-grid");
const ampsContainer = document.querySelector("#amps-container");
const statCardTemplate = document.querySelector("#stat-card-template");

let state = loadState();

document.querySelector("#add-amp").addEventListener("click", () => {
  state.amps.push(createAmp(state.amps.length + 1));
  commit();
});

document.querySelector("#export-csv").addEventListener("click", () => {
  exportCsv();
});

document.querySelector("#reset-project").addEventListener("click", () => {
  if (!window.confirm("Start a new blank project with one amp, one channel, and one speaker line?")) {
    return;
  }

  state = defaultState();
  commit();
});

projectMeta.addEventListener("change", (event) => {
  const field = event.target.closest("[data-field]");
  if (!field) {
    return;
  }

  state[field.dataset.field] = field.value;
  commit();
});

ampsContainer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const { action, ampId, channelId, speakerId, wiring } = button.dataset;

  if (action === "remove-amp") {
    state.amps = state.amps.filter((amp) => amp.id !== ampId);
  }

  if (action === "add-speaker") {
    const channel = findChannel(ampId, channelId);
    channel.speakers.push(createSpeaker(channel.speakers.length + 1));
  }

  if (action === "remove-speaker") {
    const channel = findChannel(ampId, channelId);
    channel.speakers = channel.speakers.filter((speaker) => speaker.id !== speakerId);
  }

  if (action === "set-wiring") {
    const channel = findChannel(ampId, channelId);
    channel.wiring = wiring;
  }

  commit();
});

ampsContainer.addEventListener("change", (event) => {
  const field = event.target.closest("[data-field]");
  if (!field) {
    return;
  }

  const { scope, field: fieldName, ampId, channelId, speakerId } = field.dataset;

  if (scope === "amp") {
    const amp = findAmp(ampId);
    amp[fieldName] = coerceValue(fieldName, field.value);

    if (fieldName === "channelCount") {
      amp.channels = resizeChannels(amp.channels, clampNumber(amp.channelCount, 1, 32));
    }
  }

  if (scope === "channel") {
    const channel = findChannel(ampId, channelId);
    channel[fieldName] = coerceValue(fieldName, field.value);
  }

  if (scope === "speaker") {
    const speaker = findSpeaker(ampId, channelId, speakerId);
    speaker[fieldName] = coerceValue(fieldName, field.value);
  }

  commit();
});

function defaultState() {
  return {
    projectName: "",
    seqfNumber: "",
    amps: [createAmp(1)],
  };
}

function createAmp(index) {
  return {
    id: crypto.randomUUID(),
    name: `Amp ${index}`,
    powerPerChannel: "",
    channelCount: 1,
    channels: [createChannel(1)],
  };
}

function createChannel(index) {
  return {
    id: crypto.randomUUID(),
    name: `Channel ${index}`,
    mode: "low-impedance",
    ratedImpedance: "",
    wiring: "parallel",
    speakers: [createSpeaker()],
  };
}

function createSpeaker() {
  return {
    id: crypto.randomUUID(),
    quantity: 1,
    wattage: "",
    impedance: "",
  };
}

function loadState() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaultState();
    }

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed.amps) || !parsed.amps.length) {
      return defaultState();
    }

    return parsed;
  } catch (error) {
    console.warn("Failed to load saved calculator state", error);
    return defaultState();
  }
}

function commit() {
  normalizeState();
  render();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeState() {
  state.projectName = typeof state.projectName === "string" ? state.projectName : "";
  state.seqfNumber = normalizeSeqf(state.seqfNumber);

  if (!state.amps.length) {
    state.amps.push(createAmp(1));
  }

  state.amps.forEach((amp, ampIndex) => {
    amp.name ||= `Amp ${ampIndex + 1}`;
    amp.powerPerChannel = normalizeOptionalNumber(amp.powerPerChannel, 1, 100000);
    amp.channelCount = clampNumber(amp.channelCount, 1, 32);
    amp.channels = resizeChannels(amp.channels || [], amp.channelCount);

    amp.channels.forEach((channel, channelIndex) => {
      channel.name ||= `Channel ${channelIndex + 1}`;
      channel.mode = ["low-impedance", "70v-line", "100v-line"].includes(channel.mode)
        ? channel.mode
        : "low-impedance";
      channel.ratedImpedance = channel.mode === "low-impedance"
        ? normalizeOptionalNumber(channel.ratedImpedance, 1, 64)
        : "";
      channel.wiring = channel.wiring === "series" ? "series" : "parallel";
      channel.speakers ||= [createSpeaker()];

      if (!channel.speakers.length) {
        channel.speakers.push(createSpeaker());
      }

      channel.speakers.forEach((speaker) => {
        speaker.quantity = clampNumber(speaker.quantity, 1, 512);
        speaker.wattage = normalizeOptionalNumber(speaker.wattage, 1, 100000);
        speaker.impedance = normalizeOptionalNumber(speaker.impedance, 1, 256);
      });
    });
  });
}

function resizeChannels(existingChannels, targetCount) {
  const channels = existingChannels.slice(0, targetCount);

  while (channels.length < targetCount) {
    channels.push(createChannel(channels.length + 1));
  }

  channels.forEach((channel, index) => {
    channel.name ||= `Channel ${index + 1}`;
  });

  return channels;
}

function render() {
  renderProjectMeta();
  renderSummary();
  renderAmps();
}

function renderProjectMeta() {
  projectMeta.innerHTML = [
    renderInput("Project name", "text", state.projectName, { field: "projectName" }),
    renderInput("SEQF number", "text", state.seqfNumber, { field: "seqfNumber", maxlength: 6, inputmode: "numeric", placeholder: "000000" }),
  ].join("");
}

function renderSummary() {
  const stats = getProjectStats();
  summaryGrid.innerHTML = "";

  const items = [
    { label: "Amps", value: String(stats.ampCount), tone: "" },
    { label: "Channels", value: String(stats.channelCount), tone: "" },
    { label: "Speakers", value: String(stats.speakerCount), tone: "" },
    { label: "Green", value: String(stats.greenChannels), tone: "traffic-green" },
    { label: "Yellow", value: String(stats.yellowChannels), tone: "traffic-yellow" },
    { label: "Red", value: String(stats.redChannels), tone: "traffic-red" },
  ];

  items.forEach(({ label, value, tone }) => {
    const node = statCardTemplate.content.firstElementChild.cloneNode(true);
    if (tone) {
      node.classList.add(tone);
    }
    node.querySelector(".stat-label").textContent = label;
    node.querySelector(".stat-value").textContent = value;
    summaryGrid.appendChild(node);
  });
}

function renderAmps() {
  if (!state.amps.length) {
    ampsContainer.innerHTML = '<div class="empty-state">No amps yet.</div>';
    return;
  }

  ampsContainer.innerHTML = state.amps.map((amp) => renderAmp(amp)).join("");
}

function renderAmp(amp) {
  const channelStats = amp.channels.map((channel) => calculateChannelStats(amp, channel));
  const needsAttention = channelStats.filter((stats) => stats.status !== "green").length;

  return `
    <article class="amp-card">
      <div class="amp-header">
        <div>
          <p class="mini-label">Step 1</p>
          <h3>${escapeHtml(amp.name)}</h3>
          <p class="note">Set the amp rating, then load each channel with speakers.</p>
        </div>
        <div class="button-row">
          <button class="btn btn-danger btn-inline" type="button" data-action="remove-amp" data-amp-id="${amp.id}">Remove Amp</button>
        </div>
      </div>

      <div class="amp-body">
        <div class="amp-grid">
          ${renderInput("Amp name", "text", amp.name, { scope: "amp", field: "name", ampId: amp.id })}
          ${renderInput("Power per channel (W)", "number", amp.powerPerChannel, { scope: "amp", field: "powerPerChannel", ampId: amp.id, min: 1, max: 100000, step: 1 })}
          ${renderInput("Number of channels", "number", amp.channelCount, { scope: "amp", field: "channelCount", ampId: amp.id, min: 1, max: 32, step: 1 })}
        </div>

        <div class="pill-row">
          <span class="pill">${amp.channelCount} channels</span>
          <span class="pill">${amp.channels.reduce((sum, channel) => sum + getChannelSpeakerQuantity(channel), 0)} speakers</span>
          <span class="pill ${needsAttention ? "warn" : "ok"}">${needsAttention ? `${needsAttention} channels need review` : "All channels look safe"}</span>
        </div>

        <div class="channels">
          ${amp.channels.map((channel) => renderChannel(amp, channel)).join("")}
        </div>
      </div>
    </article>
  `;
}

function renderChannel(amp, channel) {
  const stats = calculateChannelStats(amp, channel);
  const wiringPlan = channel.mode === "low-impedance" ? getOptimumWiringPlan(amp, channel) : null;

  return `
    <section class="channel-card">
      <div class="channel-header">
        <div>
          <p class="mini-label">Step 2</p>
          <h4>${escapeHtml(channel.name)}</h4>
          <p class="note">${stats.message}</p>
        </div>
        <div class="button-row">
          <button class="btn btn-secondary btn-inline" type="button" data-action="add-speaker" data-amp-id="${amp.id}" data-channel-id="${channel.id}">Add Speaker</button>
        </div>
      </div>

      <div class="channel-grid">
        ${renderInput("Channel name", "text", channel.name, { scope: "channel", field: "name", ampId: amp.id, channelId: channel.id })}
        ${renderSelect("Output mode", channel.mode, [
          ["low-impedance", "Low Impedance"],
          ["70v-line", "70V Line"],
          ["100v-line", "100V Line"],
        ], { scope: "channel", field: "mode", ampId: amp.id, channelId: channel.id })}
        ${
          channel.mode === "low-impedance"
            ? `
              ${renderInput("Channel rated impedance (ohms)", "number", channel.ratedImpedance, {
                scope: "channel",
                field: "ratedImpedance",
                ampId: amp.id,
                channelId: channel.id,
                min: 1,
                max: 64,
                step: 1,
              })}
              <div>
                <label>Wiring method</label>
                <div class="toggle-row">
                  <button class="btn btn-inline toggle ${channel.wiring === "parallel" ? "active" : ""}" type="button" data-action="set-wiring" data-amp-id="${amp.id}" data-channel-id="${channel.id}" data-wiring="parallel">Parallel</button>
                  <button class="btn btn-inline toggle ${channel.wiring === "series" ? "active" : ""}" type="button" data-action="set-wiring" data-amp-id="${amp.id}" data-channel-id="${channel.id}" data-wiring="series">Series</button>
                </div>
              </div>
            `
            : `
              <div>
                <label>Line mode</label>
                <p class="note">Wiring selection is not used for constant-voltage line outputs.</p>
              </div>
            `
        }
      </div>

      <div class="pill-row">
        <span class="pill">${getChannelSpeakerQuantity(channel)} speakers</span>
        <span class="pill">${stats.modeLabel}</span>
        <span class="pill">${stats.loadLabel}</span>
        <span class="pill">${formatWatts(stats.availablePower)} available</span>
        <span class="pill">${formatWatts(stats.totalSpeakerPower)} speaker power</span>
        <span class="pill">${formatWatts(stats.estimatedAmpOutput)} amp output</span>
        <span class="pill ${statusClass(stats.status)}">${formatPercent(stats.utilization)} usage</span>
        <span class="traffic-light ${stats.status}">
          <span class="traffic-dot"></span>
          ${statusLabel(stats.status)}
        </span>
      </div>

      ${
        channel.mode === "low-impedance"
          ? `
            <div class="wiring-plan ${wiringPlan?.recommended ? "recommended" : "not-ready"}">
              <div class="wiring-plan-header">
                <div>
                  <p class="mini-label">Optimum Wiring</p>
                  <p class="wiring-plan-title">${
                    wiringPlan?.recommended
                      ? escapeHtml(wiringPlan.name)
                      : "Enter amp impedance and speaker impedances"
                  }</p>
                </div>
                <span class="pill ${wiringPlan?.recommended && wiringPlan.safe ? "ok" : wiringPlan?.recommended ? "caution" : ""}">
                  ${
                    wiringPlan?.recommended
                      ? `${formatOhms(wiringPlan.totalImpedance)} target load`
                      : "No recommendation yet"
                  }
                </span>
              </div>
              <p class="note">${
                wiringPlan?.recommended
                  ? escapeHtml(wiringPlan.summary)
                  : "The calculator will suggest the closest safe series/parallel arrangement once the channel has enough data."
              }</p>
              ${
                wiringPlan?.recommended
                  ? `<pre class="wiring-diagram">${escapeHtml(wiringPlan.diagram)}</pre>`
                  : ""
              }
            </div>
          `
          : ""
      }

      <div class="speaker-list">
        ${channel.speakers.map((speaker) => renderSpeaker(amp.id, channel.id, channel.mode, speaker)).join("")}
      </div>
    </section>
  `;
}

function renderSpeaker(ampId, channelId, channelMode, speaker) {
  return `
    <article class="speaker-row">
      <div class="speaker-header">
        <p class="mini-label">Speaker line</p>
        <div class="speaker-actions">
          <button class="btn btn-danger btn-inline" type="button" data-action="remove-speaker" data-amp-id="${ampId}" data-channel-id="${channelId}" data-speaker-id="${speaker.id}">Remove</button>
        </div>
      </div>

      <div class="speaker-grid">
        ${renderInput("Quantity", "number", speaker.quantity, { scope: "speaker", field: "quantity", ampId, channelId, speakerId: speaker.id, min: 1, max: 512, step: 1 })}
        ${renderInput("Speaker wattage (W)", "number", speaker.wattage, { scope: "speaker", field: "wattage", ampId, channelId, speakerId: speaker.id, min: 1, max: 100000, step: 1 })}
        ${
          channelMode === "low-impedance"
            ? renderInput("Speaker impedance (ohms)", "number", speaker.impedance, {
                scope: "speaker",
                field: "impedance",
                ampId,
                channelId,
                speakerId: speaker.id,
                min: 1,
                max: 256,
                step: 1,
              })
            : `
              <div>
                <label>Speaker impedance</label>
                <p class="note">Not used for 70V or 100V line speaker entries.</p>
              </div>
            `
        }
      </div>
    </article>
  `;
}

function renderInput(label, type, value, dataset) {
  const dataAttributes = Object.entries(dataset)
    .filter(([key]) => !["min", "max", "step", "maxlength", "inputmode", "placeholder"].includes(key))
    .map(([key, current]) => `data-${camelToKebab(key)}="${escapeHtml(String(current))}"`)
    .join(" ");

  const constraintAttributes = [
    dataset.min !== undefined ? `min="${dataset.min}"` : "",
    dataset.max !== undefined ? `max="${dataset.max}"` : "",
    dataset.step !== undefined ? `step="${dataset.step}"` : "",
    dataset.maxlength !== undefined ? `maxlength="${dataset.maxlength}"` : "",
    dataset.inputmode !== undefined ? `inputmode="${dataset.inputmode}"` : "",
    dataset.placeholder !== undefined ? `placeholder="${dataset.placeholder}"` : "",
  ].join(" ");

  return `
    <label>
      ${label}
      <input type="${type}" value="${escapeHtml(String(value))}" ${dataAttributes} ${constraintAttributes}>
    </label>
  `;
}

function renderSelect(label, value, options, dataset) {
  const dataAttributes = Object.entries(dataset)
    .map(([key, current]) => `data-${camelToKebab(key)}="${escapeHtml(String(current))}"`)
    .join(" ");

  return `
    <label>
      ${label}
      <select ${dataAttributes}>
        ${options
          .map(([optionValue, optionLabel]) => `<option value="${optionValue}" ${value === optionValue ? "selected" : ""}>${optionLabel}</option>`)
          .join("")}
      </select>
    </label>
  `;
}

function calculateChannelStats(amp, channel) {
  const totalSpeakerPower = channel.speakers.reduce((sum, speaker) => sum + speaker.quantity * (Number(speaker.wattage) || 0), 0);
  const isLineMode = channel.mode !== "low-impedance";
  const ampPower = Number(amp.powerPerChannel) || 0;
  const ratedImpedance = Number(channel.ratedImpedance) || 0;

  if (isLineMode) {
    const estimatedAmpOutput = ampPower;
    const availablePower = ampPower;
    const utilization = availablePower > 0 ? totalSpeakerPower / availablePower : 0;
    const lineOverload = utilization > 1;
    const modeLabel = channel.mode === "70v-line" ? "70V Line" : "100V Line";
    const status = getStatus(utilization, false);
    const hasEnoughData = ampPower > 0 && totalSpeakerPower > 0;

    return {
      totalSpeakerPower,
      totalImpedance: null,
      estimatedAmpOutput,
      availablePower,
      utilization,
      status: hasEnoughData ? status : "green",
      message: hasEnoughData
        ? getStatusMessage(status, false, `Total speaker line load exceeds the amp's available ${formatWatts(estimatedAmpOutput)} on this channel.`)
        : "Enter amp power and speaker tap values to evaluate this channel.",
      modeLabel,
      loadLabel: totalSpeakerPower > 0 ? `${formatWatts(totalSpeakerPower)} line load` : "Load not set",
    };
  }

  const totalImpedance = calculateChannelImpedance(channel);
  const hasImpedanceData = ratedImpedance > 0 && Number.isFinite(totalImpedance);
  const estimatedAmpOutput = hasImpedanceData ? estimateAmpPowerAtLoad(ampPower, ratedImpedance, totalImpedance) : 0;
  const loadTooLow = hasImpedanceData ? totalImpedance < ratedImpedance : false;
  const availablePower = loadTooLow ? ampPower : estimatedAmpOutput;
  const utilization = availablePower > 0 ? totalSpeakerPower / availablePower : 0;
  const status = getStatus(utilization, loadTooLow);
  const hasEnoughData = ampPower > 0 && ratedImpedance > 0 && totalSpeakerPower > 0 && hasImpedanceData;

  return {
    totalSpeakerPower,
    totalImpedance,
    estimatedAmpOutput,
    availablePower,
    utilization,
    status: hasEnoughData ? status : "green",
    message: hasEnoughData
      ? getStatusMessage(status, loadTooLow, "Estimated amp output at this load is higher than the combined speaker wattage.")
      : "Enter amp power, rated impedance, and speaker values to evaluate this channel.",
    modeLabel: `Low Z ${channel.wiring === "series" ? "Series" : "Parallel"}`,
    loadLabel: hasImpedanceData ? formatOhms(totalImpedance) : "Load not set",
  };
}

function calculateChannelImpedance(channel) {
  const impedances = channel.speakers.flatMap((speaker) =>
    Array.from({ length: speaker.quantity }, () => Number(speaker.impedance) || 0),
  ).filter((value) => value > 0);

  if (!impedances.length) {
    return Infinity;
  }

  if (channel.wiring === "series") {
    return impedances.reduce((sum, impedance) => sum + impedance, 0);
  }

  return 1 / impedances.reduce((sum, impedance) => sum + 1 / impedance, 0);
}

function getChannelSpeakerUnits(channel) {
  return channel.speakers.flatMap((speaker, speakerIndex) =>
    Array.from({ length: speaker.quantity }, (_, unitIndex) => ({
      label: `L${speakerIndex + 1}.${unitIndex + 1}`,
      impedance: Number(speaker.impedance) || 0,
    })),
  ).filter((unit) => unit.impedance > 0);
}

function calculateParallelImpedance(values) {
  if (!values.length || values.some((value) => value <= 0)) {
    return Infinity;
  }

  return 1 / values.reduce((sum, value) => sum + 1 / value, 0);
}

function chunkUnits(units, groupCount) {
  if (groupCount <= 0 || units.length % groupCount !== 0) {
    return null;
  }

  const groupSize = units.length / groupCount;
  const groups = [];

  for (let index = 0; index < units.length; index += groupSize) {
    groups.push(units.slice(index, index + groupSize));
  }

  return groups.every((group) => group.length > 0) ? groups : null;
}

function buildWiringDiagram(name, groups, groupJoin, finalJoin) {
  const lines = [`${name}`];

  if (groupJoin === "series") {
    lines.push("Amp + to first speaker + in each branch.");
    groups.forEach((group, index) => {
      const speakerChain = group.map((unit) => unit.label).join(" + -> - ");
      lines.push(`Branch ${index + 1}: ${speakerChain}`);
    });
    lines.push("Join the final - of every branch together back to Amp -.");
  } else {
    groups.forEach((group, index) => {
      const speakerList = group.map((unit) => unit.label).join(", ");
      lines.push(`Group ${index + 1}: tie all + together (${speakerList}), tie all - together.`);
    });
    lines.push("Wire the groups in series:");
    lines.push(groups.map((_, index) => `Group ${index + 1}`).join(" -> "));
    lines.push("Amp + to Group 1 +, link Group 1 - to Group 2 + and continue, final group - back to Amp -.");
  }

  if (finalJoin === "parallel") {
    lines.push("Result: branch positives commoned at Amp +, branch negatives commoned at Amp -.");
  } else {
    lines.push("Result: the grouped blocks form one series path between Amp + and Amp -.");
  }

  return lines.join("\n");
}

function buildCandidate(name, units, topology, groupCount = 1) {
  if (!units.length) {
    return null;
  }

  if (topology === "parallel") {
    const totalImpedance = calculateParallelImpedance(units.map((unit) => unit.impedance));
    return {
      name: "All Parallel",
      totalImpedance,
      diagram: [
        "All Parallel",
        `Tie all + cores together: ${units.map((unit) => unit.label).join(", ")}`,
        `Tie all - cores together: ${units.map((unit) => unit.label).join(", ")}`,
        "Common + to Amp +, common - to Amp -.",
      ].join("\n"),
    };
  }

  if (topology === "series") {
    const totalImpedance = units.reduce((sum, unit) => sum + unit.impedance, 0);
    return {
      name: "All Series",
      totalImpedance,
      diagram: [
        "All Series",
        `Chain speakers in order: ${units.map((unit) => unit.label).join(" -> ")}`,
        "Amp + to first speaker +, each speaker - to next speaker +, final speaker - back to Amp -.",
      ].join("\n"),
    };
  }

  const groups = chunkUnits(units, groupCount);
  if (!groups || groups.some((group) => group.length < 2)) {
    return null;
  }

  if (topology === "series-parallel") {
    const groupImpedances = groups.map((group) => group.reduce((sum, unit) => sum + unit.impedance, 0));
    return {
      name: `${groups.length} series branches in parallel`,
      totalImpedance: calculateParallelImpedance(groupImpedances),
      diagram: buildWiringDiagram(`${groups.length} series branches in parallel`, groups, "series", "parallel"),
    };
  }

  if (topology === "parallel-series") {
    const groupImpedances = groups.map((group) => calculateParallelImpedance(group.map((unit) => unit.impedance)));
    return {
      name: `${groups.length} parallel groups in series`,
      totalImpedance: groupImpedances.reduce((sum, value) => sum + value, 0),
      diagram: buildWiringDiagram(`${groups.length} parallel groups in series`, groups, "parallel", "series"),
    };
  }

  return null;
}

function getOptimumWiringPlan(amp, channel) {
  const ratedImpedance = Number(channel.ratedImpedance) || 0;
  const ampPower = Number(amp.powerPerChannel) || 0;
  const units = getChannelSpeakerUnits(channel);

  if (!ratedImpedance || !units.length) {
    return { recommended: false };
  }

  const candidates = [
    buildCandidate("All Parallel", units, "parallel"),
    buildCandidate("All Series", units, "series"),
  ];

  for (let groupCount = 2; groupCount <= Math.floor(units.length / 2); groupCount += 1) {
    if (units.length % groupCount !== 0) {
      continue;
    }
    candidates.push(buildCandidate("", units, "series-parallel", groupCount));
    candidates.push(buildCandidate("", units, "parallel-series", groupCount));
  }

  const validCandidates = candidates
    .filter((candidate) => candidate && Number.isFinite(candidate.totalImpedance) && candidate.totalImpedance > 0)
    .map((candidate) => ({
      ...candidate,
      safe: candidate.totalImpedance >= ratedImpedance,
      delta: Math.abs(candidate.totalImpedance - ratedImpedance),
    }));

  if (!validCandidates.length) {
    return { recommended: false };
  }

  validCandidates.sort((left, right) => {
    if (left.safe !== right.safe) {
      return left.safe ? -1 : 1;
    }
    if (left.delta !== right.delta) {
      return left.delta - right.delta;
    }
    return left.totalImpedance - right.totalImpedance;
  });

  const best = validCandidates[0];
  const estimatedAmpOutput = ampPower > 0
    ? estimateAmpPowerAtLoad(ampPower, ratedImpedance, best.totalImpedance)
    : 0;
  const totalSpeakerPower = channel.speakers.reduce((sum, speaker) => sum + speaker.quantity * (Number(speaker.wattage) || 0), 0);
  const utilization = estimatedAmpOutput > 0 ? totalSpeakerPower / estimatedAmpOutput : 0;

  return {
    ...best,
    recommended: true,
    estimatedAmpOutput,
    utilization,
    summary: best.safe
      ? `Best safe match is ${best.name.toLowerCase()} at ${formatOhms(best.totalImpedance)} against a ${formatOhms(ratedImpedance)} amp channel.${ampPower > 0 ? ` Estimated amp output is ${formatWatts(estimatedAmpOutput)}.` : ""}`
      : `No safe wiring option reaches ${formatOhms(ratedImpedance)}. Closest match is ${best.name.toLowerCase()} at ${formatOhms(best.totalImpedance)}. Treat this as a compromise only.`,
  };
}

function estimateAmpPowerAtLoad(powerPerChannel, ratedImpedance, actualImpedance) {
  const voltage = Math.sqrt(powerPerChannel * ratedImpedance);
  return (voltage * voltage) / actualImpedance;
}

function getProjectStats() {
  let channelCount = 0;
  let speakerCount = 0;
  let greenChannels = 0;
  let yellowChannels = 0;
  let redChannels = 0;

  state.amps.forEach((amp) => {
    amp.channels.forEach((channel) => {
      channelCount += 1;
      speakerCount += getChannelSpeakerQuantity(channel);

      const stats = calculateChannelStats(amp, channel);
      if (stats.status === "green") greenChannels += 1;
      if (stats.status === "yellow") yellowChannels += 1;
      if (stats.status === "red") redChannels += 1;
    });
  });

  return {
    ampCount: state.amps.length,
    channelCount,
    speakerCount,
    greenChannels,
    yellowChannels,
    redChannels,
  };
}

function findAmp(ampId) {
  return state.amps.find((amp) => amp.id === ampId);
}

function findChannel(ampId, channelId) {
  return findAmp(ampId).channels.find((channel) => channel.id === channelId);
}

function findSpeaker(ampId, channelId, speakerId) {
  return findChannel(ampId, channelId).speakers.find((speaker) => speaker.id === speakerId);
}

function coerceValue(field, value) {
  if (["powerPerChannel", "ratedImpedance", "channelCount", "quantity", "wattage", "impedance"].includes(field)) {
    return Number(value);
  }

  return value;
}

function clampNumber(value, min, max) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return min;
  }

  return Math.min(Math.max(parsed, min), max);
}

function normalizeOptionalNumber(value, min, max) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  return clampNumber(value, min, max);
}

function getChannelSpeakerQuantity(channel) {
  return channel.speakers.reduce((sum, speaker) => sum + speaker.quantity, 0);
}

function getStatus(utilization, forceRed) {
  if (forceRed || utilization > 1) {
    return "red";
  }

  if (utilization > 0.9) {
    return "yellow";
  }

  return "green";
}

function getStatusMessage(status, loadTooLow, overloadMessage) {
  if (loadTooLow) {
    return "Impedance is below the amp's rated load, so this channel should be treated as unsafe.";
  }

  if (status === "red") {
    return overloadMessage;
  }

  if (status === "yellow") {
    return "Channel load is above 90% of available power, so headroom is getting tight.";
  }

  return "Channel load is within 90% of available power.";
}

function statusClass(status) {
  if (status === "green") return "ok";
  if (status === "yellow") return "caution";
  return "danger";
}

function statusLabel(status) {
  if (status === "green") return "Green";
  if (status === "yellow") return "Yellow";
  return "Red";
}

function formatPercent(value) {
  return `${(value * 100).toFixed(0)}%`;
}

async function exportCsv() {
  const rows = [[
    "Project Name",
    "SEQF Number",
    "Amp",
    "Channel",
    "Mode",
    "Wiring",
    "Speaker Lines",
    "Total Speakers",
    "Speaker Power W",
    "Available Power W",
    "Amp Output W",
    "Usage Percent",
    "Status",
    "Load",
    "Channel Rated Impedance Ohms",
    "Optimum Wiring",
    "Optimum Wiring Load",
    "Optimum Wiring Notes",
  ]];

  state.amps.forEach((amp) => {
    amp.channels.forEach((channel) => {
      const stats = calculateChannelStats(amp, channel);
      const wiringPlan = channel.mode === "low-impedance" ? getOptimumWiringPlan(amp, channel) : null;
      rows.push([
        state.projectName,
        state.seqfNumber,
        amp.name,
        channel.name,
        stats.modeLabel,
        channel.mode === "low-impedance" ? channel.wiring : "N/A",
        String(channel.speakers.length),
        String(getChannelSpeakerQuantity(channel)),
        String(Math.round(stats.totalSpeakerPower)),
        String(Math.round(stats.availablePower)),
        String(Math.round(stats.estimatedAmpOutput)),
        formatPercent(stats.utilization),
        statusLabel(stats.status),
        stats.loadLabel,
        String(channel.ratedImpedance ?? ""),
        wiringPlan?.recommended ? wiringPlan.name : "",
        wiringPlan?.recommended ? formatOhms(wiringPlan.totalImpedance) : "",
        wiringPlan?.recommended ? wiringPlan.diagram : "",
      ]);
    });
  });

  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\r\n");
  const suggestedName = buildCsvFileName();

  if (window.pywebview?.api?.export_csv) {
    try {
      const result = await window.pywebview.api.export_csv(csv, suggestedName);
      if (result?.saved) {
        return;
      }
    } catch (error) {
      console.warn("Desktop CSV export failed, falling back to browser download.", error);
    }
  }

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = suggestedName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildCsvFileName() {
  const seqf = state.seqfNumber ? `SEQF-${state.seqfNumber}` : "project";
  const projectName = state.projectName
    ? state.projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    : "amp-speaker-calculator";

  return `${seqf}-${projectName || "amp-speaker-calculator"}.csv`;
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function normalizeSeqf(value) {
  return String(value ?? "").replace(/\D/g, "").slice(0, 6);
}

function formatOhms(value) {
  return `${value.toFixed(value < 10 ? 2 : 1).replace(/\.0$/, "")} ohms`;
}

function formatWatts(value) {
  return `${Math.round(value)} W`;
}

function camelToKebab(value) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

commit();
