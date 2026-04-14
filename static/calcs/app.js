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

document.querySelector("#export-csv").addEventListener("click", exportCsv);
document.querySelector("#reset-project").addEventListener("click", () => {
  if (!window.confirm("Start a new blank project with one amp, one channel, and one speaker line?")) return;
  state = defaultState();
  commit();
});

projectMeta.addEventListener("change", (event) => {
  const field = event.target.closest("[data-field]");
  if (!field) return;
  state[field.dataset.field] = field.value;
  commit();
});

ampsContainer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action, ampId, channelId, speakerId, wiring } = button.dataset;

  if (action === "remove-amp") state.amps = state.amps.filter((amp) => amp.id !== ampId);
  if (action === "add-speaker") findChannel(ampId, channelId).speakers.push(createSpeaker());
  if (action === "remove-speaker") {
    const channel = findChannel(ampId, channelId);
    channel.speakers = channel.speakers.filter((speaker) => speaker.id !== speakerId);
  }
  if (action === "set-wiring") findChannel(ampId, channelId).wiring = wiring;

  commit();
});

ampsContainer.addEventListener("change", (event) => {
  const field = event.target.closest("[data-field]");
  if (!field) return;
  const { scope, field: fieldName, ampId, channelId, speakerId } = field.dataset;

  if (scope === "amp") {
    const amp = findAmp(ampId);
    amp[fieldName] = coerceValue(fieldName, field.value);
    if (fieldName === "channelCount") amp.channels = resizeChannels(amp.channels, clampNumber(amp.channelCount, 1, 32));
  }
  if (scope === "channel") findChannel(ampId, channelId)[fieldName] = coerceValue(fieldName, field.value);
  if (scope === "speaker") findSpeaker(ampId, channelId, speakerId)[fieldName] = coerceValue(fieldName, field.value);

  commit();
});

function defaultState() {
  return { projectName: "", seqfNumber: "", amps: [createAmp(1)] };
}

function createAmp(index) {
  return { id: crypto.randomUUID(), name: `Amp ${index}`, powerPerChannel: "", channelCount: 1, channels: [createChannel(1)] };
}

function createChannel(index) {
  return { id: crypto.randomUUID(), name: `Channel ${index}`, ratedImpedance: "", wiring: "parallel", speakers: [createSpeaker()] };
}

function createSpeaker() {
  return { id: crypto.randomUUID(), quantity: 1, wattage: "", impedance: "" };
}

function loadState() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState();
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed.amps) || !parsed.amps.length) return defaultState();
    return parsed;
  } catch {
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
  if (!state.amps.length) state.amps.push(createAmp(1));

  state.amps.forEach((amp, ampIndex) => {
    amp.name ||= `Amp ${ampIndex + 1}`;
    amp.powerPerChannel = normalizeOptionalNumber(amp.powerPerChannel, 1, 100000);
    amp.channelCount = clampNumber(amp.channelCount, 1, 32);
    amp.channels = resizeChannels(amp.channels || [], amp.channelCount);

    amp.channels.forEach((channel, channelIndex) => {
      channel.name ||= `Channel ${channelIndex + 1}`;
      channel.ratedImpedance = normalizeOptionalNumber(channel.ratedImpedance, 1, 64);
      channel.wiring = channel.wiring === "series" ? "series" : "parallel";
      if (!channel.speakers.length) channel.speakers.push(createSpeaker());

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
  while (channels.length < targetCount) channels.push(createChannel(channels.length + 1));
  channels.forEach((channel, index) => { channel.name ||= `Channel ${index + 1}`; });
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
  [
    { label: "Amps", value: String(stats.ampCount), tone: "" },
    { label: "Channels", value: String(stats.channelCount), tone: "" },
    { label: "Speakers", value: String(stats.speakerCount), tone: "" },
    { label: "Green", value: String(stats.greenChannels), tone: "traffic-green" },
    { label: "Yellow", value: String(stats.yellowChannels), tone: "traffic-yellow" },
    { label: "Red", value: String(stats.redChannels), tone: "traffic-red" },
  ].forEach(({ label, value, tone }) => {
    const node = statCardTemplate.content.firstElementChild.cloneNode(true);
    if (tone) node.classList.add(tone);
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
  ampsContainer.innerHTML = state.amps.map(renderAmp).join("");
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
        ${renderInput("Channel rated impedance (ohms)", "number", channel.ratedImpedance, { scope: "channel", field: "ratedImpedance", ampId: amp.id, channelId: channel.id, min: 1, max: 64, step: 1 })}
        <div>
          <label>Wiring method</label>
          <div class="toggle-row">
            <button class="btn btn-inline toggle ${channel.wiring === "parallel" ? "active" : ""}" type="button" data-action="set-wiring" data-amp-id="${amp.id}" data-channel-id="${channel.id}" data-wiring="parallel">Parallel</button>
            <button class="btn btn-inline toggle ${channel.wiring === "series" ? "active" : ""}" type="button" data-action="set-wiring" data-amp-id="${amp.id}" data-channel-id="${channel.id}" data-wiring="series">Series</button>
          </div>
        </div>
      </div>
      <div class="pill-row">
        <span class="pill">${getChannelSpeakerQuantity(channel)} speakers</span>
        <span class="pill">${stats.loadLabel}</span>
        <span class="pill">${formatWatts(stats.availablePower)} available</span>
        <span class="pill">${formatWatts(stats.totalSpeakerPower)} speaker power</span>
        <span class="pill">${formatWatts(stats.estimatedAmpOutput)} amp output</span>
        <span class="pill ${statusClass(stats.status)}">${formatPercent(stats.utilization)} usage</span>
        <span class="traffic-light ${stats.status}"><span class="traffic-dot"></span>${statusLabel(stats.status)}</span>
      </div>
      <div class="speaker-list">
        ${channel.speakers.map((speaker) => renderSpeaker(amp.id, channel.id, speaker)).join("")}
      </div>
    </section>
  `;
}

function renderSpeaker(ampId, channelId, speaker) {
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
        ${renderInput("Speaker impedance (ohms)", "number", speaker.impedance, { scope: "speaker", field: "impedance", ampId, channelId, speakerId: speaker.id, min: 1, max: 256, step: 1 })}
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

function calculateChannelStats(amp, channel) {
  const totalSpeakerPower = channel.speakers.reduce((sum, speaker) => sum + speaker.quantity * (Number(speaker.wattage) || 0), 0);
  const ratedImpedance = Number(channel.ratedImpedance) || 0;
  const ampPower = Number(amp.powerPerChannel) || 0;
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
    estimatedAmpOutput,
    availablePower,
    utilization,
    status: hasEnoughData ? status : "green",
    message: hasEnoughData ? getStatusMessage(status, loadTooLow) : "Enter amp power, rated impedance, and speaker values to evaluate this channel.",
    loadLabel: hasImpedanceData ? formatOhms(totalImpedance) : "Load not set",
  };
}

function calculateChannelImpedance(channel) {
  const impedances = channel.speakers.flatMap((speaker) => Array.from({ length: speaker.quantity }, () => Number(speaker.impedance) || 0)).filter((value) => value > 0);
  if (!impedances.length) return Infinity;
  if (channel.wiring === "series") return impedances.reduce((sum, impedance) => sum + impedance, 0);
  return 1 / impedances.reduce((sum, impedance) => sum + 1 / impedance, 0);
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
  return { ampCount: state.amps.length, channelCount, speakerCount, greenChannels, yellowChannels, redChannels };
}

function findAmp(ampId) { return state.amps.find((amp) => amp.id === ampId); }
function findChannel(ampId, channelId) { return findAmp(ampId).channels.find((channel) => channel.id === channelId); }
function findSpeaker(ampId, channelId, speakerId) { return findChannel(ampId, channelId).speakers.find((speaker) => speaker.id === speakerId); }
function coerceValue(field, value) { return ["powerPerChannel", "ratedImpedance", "channelCount", "quantity", "wattage", "impedance"].includes(field) ? Number(value) : value; }
function clampNumber(value, min, max) { const parsed = Number(value); return Number.isNaN(parsed) ? min : Math.min(Math.max(parsed, min), max); }
function normalizeOptionalNumber(value, min, max) { return value === "" || value === null || value === undefined ? "" : clampNumber(value, min, max); }
function getChannelSpeakerQuantity(channel) { return channel.speakers.reduce((sum, speaker) => sum + speaker.quantity, 0); }
function getStatus(utilization, forceRed) { if (forceRed || utilization > 1) return "red"; if (utilization > 0.9) return "yellow"; return "green"; }
function getStatusMessage(status, loadTooLow) {
  if (loadTooLow) return "Impedance is below the amp's rated load, so this channel should be treated as unsafe.";
  if (status === "red") return "Estimated amp output at this load is lower than the combined speaker wattage.";
  if (status === "yellow") return "Channel load is above 90% of available power, so headroom is getting tight.";
  return "Channel load is within 90% of available power.";
}
function statusClass(status) { if (status === "green") return "ok"; if (status === "yellow") return "caution"; return "danger"; }
function statusLabel(status) { if (status === "green") return "Green"; if (status === "yellow") return "Yellow"; return "Red"; }
function formatPercent(value) { return `${(value * 100).toFixed(0)}%`; }
function normalizeSeqf(value) { return String(value ?? "").replace(/\D/g, "").slice(0, 6); }
function formatOhms(value) { return `${value.toFixed(value < 10 ? 2 : 1).replace(/\.0$/, "")} ohms`; }
function formatWatts(value) { return `${Math.round(value)} W`; }
function camelToKebab(value) { return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`); }
function escapeHtml(value) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }

function exportCsv() {
  const rows = [[
    "Project Name", "SEQF Number", "Amp", "Channel", "Wiring", "Speaker Lines", "Total Speakers",
    "Speaker Power W", "Available Power W", "Amp Output W", "Usage Percent", "Status", "Load", "Rated Impedance Ohms",
  ]];

  state.amps.forEach((amp) => {
    amp.channels.forEach((channel) => {
      const stats = calculateChannelStats(amp, channel);
      rows.push([
        state.projectName, state.seqfNumber, amp.name, channel.name, channel.wiring, String(channel.speakers.length),
        String(getChannelSpeakerQuantity(channel)), String(Math.round(stats.totalSpeakerPower)), String(Math.round(stats.availablePower)),
        String(Math.round(stats.estimatedAmpOutput)), formatPercent(stats.utilization), statusLabel(stats.status), stats.loadLabel, String(channel.ratedImpedance ?? ""),
      ]);
    });
  });

  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = buildCsvFileName();
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildCsvFileName() {
  const seqf = state.seqfNumber ? `SEQF-${state.seqfNumber}` : "project";
  const projectName = state.projectName ? state.projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : "amp-speaker-calculator";
  return `${seqf}-${projectName || "amp-speaker-calculator"}.csv`;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

commit();
