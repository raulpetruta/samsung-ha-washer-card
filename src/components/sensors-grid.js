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
    washerSelect
  } = sensorData;

  // Helper to generate key-value card if data exists
  const createCard = (icon, label, value, unit = '') => {
    if (!value) return '';
    return `
      <div class="sensor-card">
        <div class="sensor-icon">${icon}</div>
        <div class="sensor-label">${label}</div>
        <div class="sensor-value">${value}${unit ? ' ' + unit : ''}</div>
      </div>
    `;
  };

  const programCard = washerSelect && washerSelect !== 'Unknown' ? `
    <div class="sensor-card">
      <div class="sensor-icon">⚙️</div>
      <div class="sensor-label">Program</div>
      <div class="sensor-value">${washerSelect}</div>
    </div>
  ` : '';

  return `
    <div class="sensors-grid">
      ${createCard('⏱️', 'Completion Time', completionTime)}
      ${createCard('⚡', 'Energy Used', energy, 'kWh')}
      ${createCard('💧', 'Water Used', waterConsumption, 'L')}
      ${createCard('🔌', 'Power Status', powerBinary)}
      ${createCard('⚡', 'Current Power', power, 'W')}
      ${createCard('💚', 'Energy Saved', energySaved, 'kWh')}
      ${createCard('👁️', 'Job State', jobState)}
      ${programCard}
    </div>
  `;
}
