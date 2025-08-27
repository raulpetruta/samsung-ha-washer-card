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

  static getAllSensorData(hass, deviceName) {
    return {
      machineState: this.getEntityValue(hass, `sensor.${deviceName}_machine_state`, 'Unknown'),
      jobState: this.getEntityValue(hass, `sensor.${deviceName}_job_state`, 'None'),
      completionTime: this.getEntityValue(hass, `sensor.${deviceName}_completion_time`, 'Unknown'),
      energy: this.getEntityValue(hass, `sensor.${deviceName}_energy`, '0'),
      energyDiff: this.getEntityValue(hass, `sensor.${deviceName}_energy_difference`, '0'),
      energySaved: this.getEntityValue(hass, `sensor.${deviceName}_energy_saved`, '0'),
      power: this.getEntityValue(hass, `sensor.${deviceName}_power`, '0'),
      powerEnergy: this.getEntityValue(hass, `sensor.${deviceName}_power_energy`, '0'),
      waterConsumption: this.getEntityValue(hass, `sensor.${deviceName}_water_consumption`, '0'),
      childLock: this.getBinaryState(hass, `binary_sensor.${deviceName}_child_lock`),
      remoteControl: this.getBinaryState(hass, `binary_sensor.${deviceName}_remote_control`),
      powerBinary: this.getBinaryState(hass, `binary_sensor.${deviceName}_power`),
      bubbleSoak: this.getSwitchState(hass, `switch.${deviceName}_bubble_soak`),
      detergentAmount: this.getEntityValue(hass, `select.${deviceName}_detergent_dispense_amount`, 'Extra'),
      rinseCycles: this.getEntityValue(hass, `number.${deviceName}_rinse_cycles`, '2'),
      spinLevel: this.getEntityValue(hass, `select.${deviceName}_spin_level`, '1400'),
      washerSelect: this.getEntityValue(hass, `select.${deviceName}`, 'Unknown')
    };
  }
}
