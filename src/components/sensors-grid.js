// Sensors grid component HTML generator
export function createSensorsGrid(sensorData) {
  const {
    completionTime,
    energy,
    waterConsumption,
    powerBinary,
    power,
    energySaved,
    jobState,
    deviceSelect,
    isDryer
  } = sensorData;

  const programCard = deviceSelect !== 'Unknown' ? `
    <div class="sensor-card">
      <div class="sensor-icon">⚙️</div>
      <div class="sensor-label">Program</div>
      <div class="sensor-value">${deviceSelect}</div>
    </div>
  ` : '';

  // Hide water consumption for dryers
  const waterCard = !isDryer ? `
    <div class="sensor-card">
      <div class="sensor-icon">💧</div>
      <div class="sensor-label">Water Used</div>
      <div class="sensor-value">${waterConsumption} L</div>
    </div>
  ` : '';

  return `
    <div class="sensors-grid">
      <div class="sensor-card">
        <div class="sensor-icon">⏱️</div>
        <div class="sensor-label">Completion Time</div>
        <div class="sensor-value">${completionTime}</div>
      </div>
      
      <div class="sensor-card">
        <div class="sensor-icon">⚡</div>
        <div class="sensor-label">Energy Used</div>
        <div class="sensor-value">${energy} kWh</div>
      </div>
      
      ${waterCard}
      
      <div class="sensor-card">
        <div class="sensor-icon">🔌</div>
        <div class="sensor-label">Power Status</div>
        <div class="sensor-value">${powerBinary}</div>
      </div>
      
      <div class="sensor-card">
        <div class="sensor-icon">⚡</div>
        <div class="sensor-label">Current Power</div>
        <div class="sensor-value">${power} W</div>
      </div>
      
      <div class="sensor-card">
        <div class="sensor-icon">💚</div>
        <div class="sensor-label">Energy Saved</div>
        <div class="sensor-value">${energySaved} kWh</div>
      </div>
      
      <div class="sensor-card">
        <div class="sensor-icon">👁️</div>
        <div class="sensor-label">Job State</div>
        <div class="sensor-value">${jobState}</div>
      </div>

      ${programCard}
    </div>
  `;
}
