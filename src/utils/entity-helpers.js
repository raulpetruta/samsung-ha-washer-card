// Entity helper functions for interacting with Home Assistant entities
export class EntityHelpers {
  
  static getEntityValue(hass, entityId, defaultValue) {
    const entity = hass.states[entityId];
    if (entity && entity.state !== 'unavailable' && entity.state !== 'unknown') {
      return entity.state;
    }
    return defaultValue;
  }

  static getBinaryState(hass, entityId) {
    const entity = hass.states[entityId];
    if (entity && entity.state !== 'unavailable' && entity.state !== 'unknown') {
      return entity.state === 'on' ? 'On' : 'Off';
    }
    return 'Off';
  }

  static getSwitchState(hass, entityId) {
    const entity = hass.states[entityId];
    if (entity && entity.state !== 'unavailable' && entity.state !== 'unknown') {
      return entity.state === 'on' ? 'On' : 'Off';
    }
    return 'Off';
  }

  static getAllSensorData(hass, config) {
    const deviceName = config.device_name?.includes('.') ? config.device_name.split('.')[1] : config.device_name;
    
    // Helper to get configured sensor or null
    const getConfiguredValue = (configKey, suffix, defaultValue = null) => {
      const entityId = config[configKey];
      if (entityId) {
        return this.getEntityValue(hass, entityId, defaultValue);
      }
      return null;
    };

    // Helper for binary sensors
    const getConfiguredBinary = (configKey, defaultValue = null) => {
      const entityId = config[configKey];
      if (entityId) {
        return this.getBinaryState(hass, entityId);
      }
      return null;
    };

    return {
      // Core state (keep auto-detection for animations)
      machineState: this.getEntityValue(hass, `sensor.${deviceName}_machine_state`, 'Unknown'),
      
      // Configurable sensors (returns null if not selected)
      jobState: getConfiguredValue('job_state_entity', null, 'None'),
      completionTime: getConfiguredValue('completion_time_entity', null, 'Unknown'),
      energy: getConfiguredValue('energy_entity', null, '0'),
      energySaved: getConfiguredValue('energy_saved_entity', null, '0'),
      power: getConfiguredValue('power_entity', null, '0'),
      waterConsumption: getConfiguredValue('water_entity', null, '0'),
      powerBinary: getConfiguredBinary('power_binary_entity'),
      washerSelect: getConfiguredValue('program_entity', null, 'Unknown'),

      // Controls (keep auto-detection for now, user only specified "sensors from the sensor card")
      energyDiff: this.getEntityValue(hass, `sensor.${deviceName}_energy_difference`, '0'),
      powerEnergy: this.getEntityValue(hass, `sensor.${deviceName}_power_energy`, '0'),
      childLock: this.getBinaryState(hass, `binary_sensor.${deviceName}_child_lock`),
      remoteControl: this.getBinaryState(hass, `binary_sensor.${deviceName}_remote_control`),
      bubbleSoak: this.getSwitchState(hass, `switch.${deviceName}_bubble_soak`),
      detergentAmount: this.getEntityValue(hass, `select.${deviceName}_detergent_dispense_amount`, 'Extra'),
      rinseCycles: this.getEntityValue(hass, `number.${deviceName}_rinse_cycles`, '2'),
      spinLevel: this.getEntityValue(hass, `select.${deviceName}_spin_level`, '1400'),
    };
  }
}
