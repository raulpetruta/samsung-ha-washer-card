// Entity helper functions for interacting with Home Assistant entities.
// LocalThings entities are matched by translation_key on the anchor's device.
// Older SmartThings dashboards still resolve through object-id suffixes.

const SLOT_DEFS = {
  machineState: {
    keys: ['machine_state'],
    domains: ['sensor'],
    legacySuffix: 'machine_state',
    legacyDomain: 'sensor',
  },
  progress: {
    keys: ['progress'],
    domains: ['sensor'],
  },
  cycleActive: {
    keys: ['cycle_active'],
    domains: ['binary_sensor'],
  },
  program: {
    keys: ['washer_cycle', 'dryer_cycle', 'cycle'],
    keyPrefixes: ['washer_cycle', 'dryer_cycle'],
    domains: ['select'],
    configKey: 'program_entity',
  },
  completionTime: {
    keys: ['finish_time'],
    domains: ['sensor'],
    legacySuffix: 'completion_time',
    legacyDomain: 'sensor',
    configKey: 'completion_time_entity',
  },
  energy: {
    keys: ['energy_kwh'],
    domains: ['sensor'],
    legacySuffix: 'energy',
    legacyDomain: 'sensor',
    configKey: 'energy_entity',
    fallbackUnit: 'kWh',
  },
  energySaved: {
    keys: ['energy_saved_kwh'],
    domains: ['sensor'],
    legacySuffix: 'energy_saved',
    legacyDomain: 'sensor',
    configKey: 'energy_saved_entity',
    fallbackUnit: 'kWh',
  },
  power: {
    keys: ['power_watts'],
    domains: ['sensor'],
    legacySuffix: 'power',
    legacyDomain: 'sensor',
    configKey: 'power_entity',
    fallbackUnit: 'W',
  },
  water: {
    keys: ['water_liters'],
    domains: ['sensor'],
    legacySuffix: 'water_consumption',
    legacyDomain: 'sensor',
    configKey: 'water_entity',
    fallbackUnit: 'L',
  },
  powerBinary: {
    keys: ['power_switch'],
    domains: ['binary_sensor', 'switch'],
    preferDomain: 'binary_sensor',
    legacySuffix: 'power',
    legacyDomain: 'binary_sensor',
    configKey: 'power_binary_entity',
  },
  jobState: {
    keys: ['progress'],
    domains: ['sensor'],
    legacySuffix: 'job_state',
    legacyDomain: 'sensor',
    configKey: 'job_state_entity',
  },
  childLock: {
    keys: ['child_lock'],
    domains: ['binary_sensor', 'switch'],
    legacySuffix: 'child_lock',
    legacyDomain: 'binary_sensor',
  },
  remoteControl: {
    keys: ['remote_control'],
    domains: ['binary_sensor'],
    legacySuffix: 'remote_control',
    legacyDomain: 'binary_sensor',
  },
  bubbleSoak: {
    keys: ['bubble_soak'],
    domains: ['switch'],
    legacySuffix: 'bubble_soak',
    legacyDomain: 'switch',
  },
  detergent: {
    keys: ['detergent_quantity'],
    domains: ['select'],
    legacySuffix: 'detergent_dispense_amount',
    legacyDomain: 'select',
  },
  rinseCycles: {
    keys: ['rinse_cycles'],
    domains: ['select', 'number'],
    legacySuffix: 'rinse_cycles',
    legacyDomain: 'number',
  },
  spinLevel: {
    keys: ['spin_speed'],
    domains: ['select'],
    legacySuffix: 'spin_level',
    legacyDomain: 'select',
  },
  washTemperature: {
    keys: ['wash_temperature', 'water_temperature'],
    domains: ['select'],
    legacySuffix: 'water_temperature',
    legacyDomain: 'select',
    configKey: 'water_temperature_entity',
  },
  wrinklePrevent: {
    keys: ['wrinkle_prevent'],
    domains: ['switch', 'binary_sensor'],
    preferDomain: 'switch',
    legacySuffix: 'wrinkle_prevent',
    legacyDomain: 'switch',
    legacyFallbacks: [
      { domain: 'binary_sensor', suffix: 'wrinkle_prevent_active' },
    ],
    configKey: 'wrinkle_prevent_entity',
  },
  dryLevel: {
    keys: ['dry_level', 'washer_dry_level'],
    domains: ['select'],
    legacySuffix: 'dry_level',
    legacyDomain: 'select',
    configKey: 'dry_level_entity',
  },
};

function isUsableState(state) {
  return state !== undefined && state !== null && state !== 'unavailable' && state !== 'unknown' && state !== '';
}

function keyMatches(translationKey, slot) {
  if (!translationKey) return false;
  if (slot.keys?.includes(translationKey)) return true;
  const prefixes = slot.keyPrefixes || (slot.keyPrefix ? [slot.keyPrefix] : []);
  return prefixes.some((prefix) => translationKey === prefix || translationKey.startsWith(`${prefix}_`));
}

export class EntityHelpers {
  static getAnchorEntityId(config) {
    const name = config?.device_name || '';
    return name.includes('.') ? name : null;
  }

  static getLegacyPrefix(config) {
    const name = config?.device_name || config?.entity_prefix || '';
    if (!name) return '';
    if (name.includes('.')) return name.split('.').slice(1).join('.');
    return name;
  }

  static getEntity(hass, entityId) {
    if (!entityId || !hass?.states) return null;
    const entity = hass.states[entityId];
    if (!entity || !isUsableState(entity.state)) return null;
    return entity;
  }

  static getEntityValue(hass, entityId, defaultValue) {
    const entity = this.getEntity(hass, entityId);
    return entity ? entity.state : defaultValue;
  }

  static getState(hass, entityId) {
    return this.getEntityValue(hass, entityId, null);
  }

  static formatToggle(hass, entityId) {
    const entity = this.getEntity(hass, entityId);
    if (!entity) return null;
    const isOn = entity.state === 'on';
    if (entity.attributes?.device_class === 'lock') {
      return isOn ? 'Unlocked' : 'Locked';
    }
    return isOn ? 'On' : 'Off';
  }

  static readSensor(hass, entityId, fallbackUnit) {
    const entity = this.getEntity(hass, entityId);
    if (!entity) return { value: null, unit: fallbackUnit || '' };
    return {
      value: entity.state,
      unit: entity.attributes?.unit_of_measurement || fallbackUnit || '',
    };
  }

  static collectDeviceEntityIds(hass, anchorId) {
    const registry = hass?.entities;
    if (!registry || !anchorId || !registry[anchorId]?.device_id) return [];
    const deviceId = registry[anchorId].device_id;
    return Object.keys(registry).filter((id) => registry[id]?.device_id === deviceId);
  }

  static findByTranslationKey(hass, entityIds, slot) {
    const matches = entityIds.filter((id) => {
      const domain = id.split('.')[0];
      if (slot.domains && !slot.domains.includes(domain)) return false;
      return keyMatches(hass.entities?.[id]?.translation_key, slot);
    });
    if (!matches.length) return null;

    const preferred = slot.preferDomain
      ? matches.find((id) => id.startsWith(`${slot.preferDomain}.`))
      : null;
    const available = matches.find((id) => this.getEntity(hass, id));
    return preferred && this.getEntity(hass, preferred)
      ? preferred
      : available || preferred || matches[0];
  }

  static resolveEntityId(hass, config, slotName, deviceEntityIds, prefix) {
    const slot = SLOT_DEFS[slotName];
    const configuredId = slot.configKey ? config?.[slot.configKey] : '';
    if (configuredId) return configuredId;

    const matched = this.findByTranslationKey(hass, deviceEntityIds, slot);
    if (matched) return matched;

    if (slot.legacySuffix && slot.legacyDomain && prefix) {
      const primary = `${slot.legacyDomain}.${prefix}_${slot.legacySuffix}`;
      if (!slot.legacyFallbacks || hass?.states?.[primary]) return primary;
      const fallback = slot.legacyFallbacks
        .map((item) => `${item.domain}.${prefix}_${item.suffix}`)
        .find((entityId) => hass?.states?.[entityId]);
      return fallback || primary;
    }
    return null;
  }

  static getDisplayName(hass, config) {
    const anchorId = this.getAnchorEntityId(config);
    const deviceId = anchorId && hass?.entities?.[anchorId]?.device_id;
    const device = deviceId && hass?.devices?.[deviceId];
    if (device?.name_by_user) return device.name_by_user;
    if (device?.name) return device.name;
    const friendlyName = anchorId && hass?.states?.[anchorId]?.attributes?.friendly_name;
    if (friendlyName) return friendlyName;
    return null;
  }

  static getAllSensorData(hass, config) {
    const prefix = this.getLegacyPrefix(config);
    const anchorId = this.getAnchorEntityId(config);
    const deviceEntityIds = this.collectDeviceEntityIds(hass, anchorId);
    const resolve = (slotName) => this.resolveEntityId(hass, config, slotName, deviceEntityIds, prefix);

    const energy = this.readSensor(hass, resolve('energy'), SLOT_DEFS.energy.fallbackUnit);
    const energySaved = this.readSensor(hass, resolve('energySaved'), SLOT_DEFS.energySaved.fallbackUnit);
    const power = this.readSensor(hass, resolve('power'), SLOT_DEFS.power.fallbackUnit);
    const water = this.readSensor(hass, resolve('water'), SLOT_DEFS.water.fallbackUnit);
    const cycleState = this.getState(hass, resolve('cycleActive'));

    return {
      machineState: this.getState(hass, resolve('machineState')) || 'Unknown',
      progress: this.getState(hass, resolve('progress')),
      cycleActive: cycleState === null ? null : cycleState === 'on',
      jobState: this.getState(hass, resolve('jobState')),
      completionTime: this.getState(hass, resolve('completionTime')),
      energy: energy.value,
      energyUnit: energy.unit,
      energySaved: energySaved.value,
      energySavedUnit: energySaved.unit,
      power: power.value,
      powerUnit: power.unit,
      waterConsumption: water.value,
      waterUnit: water.unit,
      powerBinary: this.formatToggle(hass, resolve('powerBinary')),
      washerSelect: this.getState(hass, resolve('program')),
      childLock: this.formatToggle(hass, resolve('childLock')),
      remoteControl: this.formatToggle(hass, resolve('remoteControl')),
      bubbleSoak: this.formatToggle(hass, resolve('bubbleSoak')),
      detergentAmount: this.getState(hass, resolve('detergent')),
      rinseCycles: this.getState(hass, resolve('rinseCycles')),
      spinLevel: this.getState(hass, resolve('spinLevel')),
      washTemperature: this.getState(hass, resolve('washTemperature')),
      wrinklePrevent: this.formatToggle(hass, resolve('wrinklePrevent')),
      dryLevel: this.getState(hass, resolve('dryLevel')),
    };
  }
}
