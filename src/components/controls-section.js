// Controls section component HTML generator
export function createControlsSection(controlsData) {
  const {
    childLock,
    remoteControl,
    bubbleSoak,
    detergentAmount,
    rinseCycles,
    spinLevel
  } = controlsData;

  const displayValue = (value) => (value == null || value === '' ? '—' : value);

  return `
    <div class="controls-section">
      <div class="controls-title">Configuration & Controls</div>
      
      <div class="controls-grid">
        <div class="control-item">
          <span class="control-label">🔒 Child Lock</span>
          <span class="control-value">${displayValue(childLock)}</span>
        </div>
        
        <div class="control-item">
          <span class="control-label">📱 Remote Control</span>
          <span class="control-value">${displayValue(remoteControl)}</span>
        </div>
        
        <div class="control-item">
          <span class="control-label">🫧 Bubble Soak</span>
          <span class="control-value">${displayValue(bubbleSoak)}</span>
        </div>
        
        <div class="control-item">
          <span class="control-label">🧴 Detergent</span>
          <span class="control-value">${displayValue(detergentAmount)}</span>
        </div>
        
        <div class="control-item">
          <span class="control-label">🔄 Rinse Cycles</span>
          <span class="control-value">${displayValue(rinseCycles)}</span>
        </div>
        
        <div class="control-item">
          <span class="control-label">🌪️ Spin Level</span>
          <span class="control-value">${displayValue(spinLevel)}</span>
        </div>
      </div>
    </div>
  `;
}
