// Formatter utility functions
const IN_CYCLE_STAGES = new Set([
  'wash',
  'washing',
  'rinse',
  'rinsing',
  'spin',
  'spinning',
  'dry',
  'drying',
  'prewash',
  'pre wash',
  'weight sensing',
  'weightsensing',
  'delaywash',
  'delay wash',
  'soak',
  'cooling',
  'refreshing',
  'wrinkle prevent',
  'dehumidifying',
  'ai drying',
  'sanitizing',
  'internal care',
  'freeze protection',
  'continuous dehumidifying',
  'thawing frozen inside',
]);

const PAUSED_STATES = new Set(['pause', 'paused']);
const FINISHED_STAGES = new Set(['finish', 'finished']);
const MACHINE_COMMANDS = new Set(['run', 'stop', 'pause', 'paused', 'start', 'active', 'idle']);

export class Formatters {
  static formatDeviceName(deviceName) {
    return String(deviceName || '')
      .split('_')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  static normalizeState(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ');
  }

  static formatStage(value) {
    if (value == null || value === '') return null;
    return this.normalizeState(value).replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  static formatCompletionTime(timeStr) {
    if (!timeStr || timeStr === 'Unknown' || timeStr === 'unavailable') return null;

    const date = new Date(timeStr);
    if (Number.isNaN(date.getTime())) return null;

    const diffMs = date.getTime() - Date.now();
    const elapsed = Math.abs(diffMs);
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const clock = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    return diffMs < 0 ? `${clock} ago` : `${clock} left`;
  }

  static formatSensorValue(value) {
    if (value == null || value === '') return null;
    const number = Number(value);
    if (!Number.isFinite(number)) return value;
    if (Number.isInteger(number)) return String(number);
    return String(parseFloat(number.toFixed(2)));
  }

  static formatSpin(value) {
    if (value == null || value === '') return '—';
    const text = String(value).trim();
    return /^-?\d+(\.\d+)?$/.test(text) ? `${text} RPM` : text;
  }

  static formatTemperature(value) {
    if (value == null || value === '') return '—';
    const text = String(value).trim();
    if (text.includes('°')) return text;
    return /^-?\d+(\.\d+)?$/.test(text) ? `${text}°C` : text;
  }

  static getIconHtml(icon) {
    return icon.includes(':')
      ? `<ha-icon icon="${icon}"></ha-icon>`
      : icon;
  }

  static stageOf(sensorData) {
    return this.normalizeState(sensorData?.progress || sensorData?.jobState);
  }

  static isRunningState(state) {
    return state === 'run' || state === 'running' || state === 'active'
      || state.includes('running') || state.includes('wash');
  }

  static isStoppedState(state) {
    return state === 'stop' || state === 'stopped' || state.includes('stopped');
  }

  static isFinishedStage(progress) {
    return FINISHED_STAGES.has(this.normalizeState(progress));
  }

  static getActivity(sensorData) {
    const state = this.normalizeState(sensorData?.machineState);
    const stage = this.stageOf(sensorData);

    if (PAUSED_STATES.has(state) || PAUSED_STATES.has(stage)) return 'paused';
    if (FINISHED_STAGES.has(stage)) return 'idle';
    if (IN_CYCLE_STAGES.has(stage)) return 'running';
    if (this.isRunningState(state)) return 'running';
    if (sensorData?.cycleActive === true) return 'running';
    return 'idle';
  }

  static getStatusClass(activity, machineState, progress) {
    if (activity === 'running') return 'status-running';
    if (activity === 'paused') return 'status-paused';
    if (this.isFinishedStage(progress) || this.isStoppedState(this.normalizeState(machineState))) {
      return 'status-stopped';
    }
    return 'status-idle';
  }

  static getAnimationClass(activity, isRecentlyCompleted) {
    if (activity === 'running') return 'running';
    if (isRecentlyCompleted) return 'completed';
    return '';
  }

  static getStatusLightClass(activity, isRecentlyCompleted) {
    if (activity === 'running') return 'running';
    if (isRecentlyCompleted) return 'completed';
    return 'idle';
  }

  static getStatusText(sensorData) {
    const program = sensorData?.washerSelect;
    const programKey = this.normalizeState(program);
    if (program && program !== 'Unknown' && !MACHINE_COMMANDS.has(programKey)) return program;

    const stage = sensorData?.progress || sensorData?.jobState;
    const stageKey = this.normalizeState(stage);
    const state = this.normalizeState(sensorData?.machineState);
    const machineIsGeneric = !state || MACHINE_COMMANDS.has(state) || state === 'unknown' || state === 'ready';
    if (machineIsGeneric && stageKey && stageKey !== 'none' && stageKey !== 'unknown' && stageKey !== 'idle') {
      return this.formatStage(stage);
    }
    return sensorData?.machineState || 'Unknown';
  }

  static nextRememberedFinish({ live, remembered, finishWasLive, activity, now }) {
    if (live && !Number.isNaN(new Date(live).getTime())) {
      return { remembered: live, finishWasLive: true };
    }

    if (finishWasLive && activity !== 'running' && activity !== 'paused') {
      const rememberedMs = remembered ? new Date(remembered).getTime() : NaN;
      const next = Number.isFinite(rememberedMs) && rememberedMs <= now
        ? remembered
        : new Date(now).toISOString();
      return { remembered: next, finishWasLive: false };
    }

    return { remembered: remembered || null, finishWasLive: Boolean(finishWasLive) };
  }

  static isWithinCompletionWindow(timestamp, hours, now) {
    if (!timestamp) return false;
    const completionMs = new Date(timestamp).getTime();
    if (Number.isNaN(completionMs)) return false;
    const diffMs = now - completionMs;
    return diffMs >= 0 && diffMs <= hours * 60 * 60 * 1000;
  }
}
