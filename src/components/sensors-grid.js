// Sensors grid component HTML generator
export function createSensorsGrid(sensorData) {
  const {
    completionTime,
    energy,
    energyUnit,
    waterConsumption,
    waterUnit,
    powerBinary,
    power,
    powerUnit,
    energySaved,
    energySavedUnit,
    jobState
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

  return `
    <div class="sensors-grid">
      ${createCard('⏱️', 'Completion Time', completionTime)}
      ${createCard('⚡', 'Energy Used', energy, energyUnit)}
      ${createCard('💧', 'Water Used', waterConsumption, waterUnit)}
      ${createCard('🔌', 'Power Status', powerBinary)}
      ${createCard('⚡', 'Current Power', power, powerUnit)}
      ${createCard('💚', 'Energy Saved', energySaved, energySavedUnit)}
      ${createCard('👁️', 'Job State', jobState)}
    </div>
  `;
}
