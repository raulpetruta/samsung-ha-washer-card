const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadHelpers() {
  const read = (relativePath) => fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8')
    .replace(/export\s+class\s+/g, 'class ')
    .replace(/export\s+function\s+/g, 'function ')
    .replace(/export\s+\{[^}]*\};?/g, '');

  const context = {};
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(
    `${read('src/utils/entity-helpers.js')}\n${read('src/utils/formatters.js')}\nglobalThis.EntityHelpers = EntityHelpers;\nglobalThis.Formatters = Formatters;`,
    context
  );
  return context;
}

const { EntityHelpers, Formatters } = loadHelpers();

function state(value, attributes = {}) {
  return { state: value, attributes };
}

test('legacy prefix still finds SmartThings object ids and does not invent missing controls', () => {
  const hass = {
    states: {
      'sensor.washing_machine_machine_state': state('Running'),
      'sensor.washing_machine_job_state': state('Weight Sensing'),
      'sensor.washing_machine_completion_time': state('2026-09-29T18:00:00.000Z'),
      'sensor.washing_machine_energy': state('1.2'),
      'select.washing_machine_spin_level': state('1400'),
      'select.washing_machine_water_temperature': state('40'),
      'binary_sensor.washing_machine_child_lock': state('on'),
    },
  };

  const data = EntityHelpers.getAllSensorData(hass, { device_name: 'washing_machine' });

  assert.equal(data.machineState, 'Running');
  assert.equal(data.jobState, 'Weight Sensing');
  assert.equal(data.energy, '1.2');
  assert.equal(data.energyUnit, 'kWh');
  assert.equal(data.spinLevel, '1400');
  assert.equal(data.washTemperature, '40');
  assert.equal(data.childLock, 'On');
  assert.equal(data.detergentAmount, null);
  assert.equal(data.rinseCycles, null);
  assert.equal(data.bubbleSoak, null);
  assert.equal(data.remoteControl, null);
});

test('full entity id without a device registry keeps the legacy object-id prefix', () => {
  const hass = {
    states: {
      'sensor.washing_machine_machine_state': state('Stopped'),
    },
  };

  const data = EntityHelpers.getAllSensorData(hass, { device_name: 'select.washing_machine' });
  assert.equal(data.machineState, 'Stopped');
});

test('LocalThings siblings resolve by translation key, including course-table cycle keys', () => {
  const deviceId = 'washer-1';
  const entities = {
    'sensor.washer_machine_state': { device_id: deviceId, translation_key: 'machine_state', platform: 'localthings' },
    'sensor.washer_progress': { device_id: deviceId, translation_key: 'progress', platform: 'localthings' },
    'binary_sensor.washer_cycle_active': { device_id: deviceId, translation_key: 'cycle_active', platform: 'localthings' },
    'select.washer_cycle': { device_id: deviceId, translation_key: 'washer_cycle_table_02', platform: 'localthings' },
    'sensor.washer_finish_time': { device_id: deviceId, translation_key: 'finish_time', platform: 'localthings' },
    'sensor.washer_energy': { device_id: deviceId, translation_key: 'energy_kwh', platform: 'localthings' },
    'sensor.washer_water': { device_id: deviceId, translation_key: 'water_liters', platform: 'localthings' },
    'binary_sensor.washer_power': { device_id: deviceId, translation_key: 'power_switch', platform: 'localthings' },
    'switch.washer_power': { device_id: deviceId, translation_key: 'power_switch', platform: 'localthings' },
    'binary_sensor.washer_child_lock': { device_id: deviceId, translation_key: 'child_lock', platform: 'localthings' },
    'select.washer_spin': { device_id: deviceId, translation_key: 'spin_speed', platform: 'localthings' },
    'select.washer_rinse': { device_id: deviceId, translation_key: 'rinse_cycles', platform: 'localthings' },
    'select.washer_detergent': { device_id: deviceId, translation_key: 'detergent_quantity', platform: 'localthings' },
    'select.washer_temperature': { device_id: deviceId, translation_key: 'wash_temperature', platform: 'localthings' },
  };
  const hass = {
    entities,
    devices: { [deviceId]: { name: 'Laundry Washer', name_by_user: 'Upstairs washer' } },
    states: {
      'sensor.washer_machine_state': state('active'),
      'sensor.washer_progress': state('wash'),
      'binary_sensor.washer_cycle_active': state('on'),
      'select.washer_cycle': state('Cotton'),
      'sensor.washer_finish_time': state('2026-09-29T19:00:00.000Z'),
      'sensor.washer_energy': state('0.4', { unit_of_measurement: 'kWh' }),
      'sensor.washer_water': state('12', { unit_of_measurement: 'L' }),
      'binary_sensor.washer_power': state('off', { device_class: 'power' }),
      'switch.washer_power': state('on'),
      'binary_sensor.washer_child_lock': state('on', { device_class: 'lock' }),
      'select.washer_spin': state('No Spin'),
      'select.washer_rinse': state('2'),
      'select.washer_detergent': state('Medium'),
      'select.washer_temperature': state('30'),
    },
  };

  const data = EntityHelpers.getAllSensorData(hass, { device_name: 'sensor.washer_machine_state' });

  assert.equal(data.machineState, 'active');
  assert.equal(data.progress, 'wash');
  assert.equal(data.cycleActive, true);
  assert.equal(data.washerSelect, 'Cotton');
  assert.equal(data.jobState, 'wash');
  assert.equal(data.energy, '0.4');
  assert.equal(data.energyUnit, 'kWh');
  assert.equal(data.waterUnit, 'L');
  assert.equal(data.powerBinary, 'Off');
  assert.equal(data.childLock, 'Unlocked');
  assert.equal(data.spinLevel, 'No Spin');
  assert.equal(data.rinseCycles, '2');
  assert.equal(data.detergentAmount, 'Medium');
  assert.equal(data.washTemperature, '30');
  assert.equal(Formatters.formatTemperature('30'), '30°C');
  assert.equal(Formatters.formatTemperature('Cold'), 'Cold');
  assert.equal(EntityHelpers.getDisplayName(hass, { device_name: 'sensor.washer_machine_state' }), 'Upstairs washer');
  assert.equal(Formatters.getActivity(data), 'running');
  assert.equal(Formatters.getStatusText(data), 'Cotton');
  assert.equal(Formatters.formatSpin(data.spinLevel), 'No Spin');
  assert.equal(Formatters.formatSpin('800'), '800 RPM');
  assert.equal(Formatters.formatSensorValue('4.75509694244667'), '4.76');
  assert.equal(Formatters.formatSensorValue('186'), '186');
  assert.equal(Formatters.formatSensorValue('wash'), 'wash');
});

test('an explicit entity picker wins over the device translation key', () => {
  const deviceId = 'washer-1';
  const hass = {
    entities: {
      'select.washer_cycle': { device_id: deviceId, translation_key: 'washer_cycle' },
      'select.other_program': { device_id: deviceId, translation_key: 'something_else' },
    },
    states: {
      'select.washer_cycle': state('Cotton'),
      'select.other_program': state('Delicates'),
    },
  };

  const data = EntityHelpers.getAllSensorData(hass, {
    device_name: 'select.washer_cycle',
    program_entity: 'select.other_program',
  });
  assert.equal(data.washerSelect, 'Delicates');
});

test('child lock without the lock device class stays On or Off', () => {
  const hass = {
    states: {
      'binary_sensor.washing_machine_child_lock': state('off'),
    },
  };
  const data = EntityHelpers.getAllSensorData(hass, { device_name: 'washing_machine' });
  assert.equal(data.childLock, 'Off');
});

test('status follows LocalThings machine state and progress', () => {
  assert.equal(Formatters.getActivity({ machineState: 'active', progress: 'rinse' }), 'running');
  assert.equal(Formatters.getActivity({ machineState: 'pause', progress: 'wash' }), 'paused');
  assert.equal(Formatters.getActivity({ machineState: 'active', progress: 'finish' }), 'idle');
  assert.equal(Formatters.getActivity({ machineState: 'Running' }), 'running');
  assert.equal(Formatters.getActivity({ machineState: 'Stopped' }), 'idle');
  assert.equal(Formatters.getStatusClass('idle', 'Stopped'), 'status-stopped');
  assert.equal(Formatters.getStatusClass('paused', 'pause'), 'status-paused');
  assert.equal(Formatters.getStatusClass('idle', 'active', 'finish'), 'status-stopped');
  assert.equal(Formatters.getStatusText({ machineState: 'active', progress: 'spin' }), 'Spin');
  assert.equal(Formatters.getAnimationClass('running', false), 'running');
  assert.equal(Formatters.getAnimationClass('paused', false), '');
  assert.equal(Formatters.getStatusLightClass('idle', true), 'completed');
});

test('a cleared future finish time becomes the completion moment once the cycle stops', () => {
  const now = Date.parse('2026-09-29T18:00:00.000Z');
  const whileRunning = Formatters.nextRememberedFinish({
    live: '2026-09-29T18:20:00.000Z',
    remembered: null,
    finishWasLive: false,
    activity: 'running',
    now,
  });
  assert.equal(whileRunning.remembered, '2026-09-29T18:20:00.000Z');
  assert.equal(whileRunning.finishWasLive, true);

  const afterStop = Formatters.nextRememberedFinish({
    live: null,
    remembered: whileRunning.remembered,
    finishWasLive: whileRunning.finishWasLive,
    activity: 'idle',
    now,
  });
  assert.equal(afterStop.remembered, '2026-09-29T18:00:00.000Z');
  assert.equal(afterStop.finishWasLive, false);
  assert.equal(Formatters.isWithinCompletionWindow(afterStop.remembered, 2, now), true);
  assert.equal(Formatters.isFinishedStage('finish'), true);
});
