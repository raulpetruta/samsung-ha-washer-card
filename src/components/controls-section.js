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

  return `
    <div class="controls-section">
      <div class="controls-title">Configuration & Controls</div>
      
      <div class="controls-grid">
        <div class="control-item">
          <span class="control-label">🔒 Child Lock</span>
          <span class="control-value">${childLock}</span>
        </div>
        
        <div class="control-item">
          <span class="control-label">📱 Remote Control</span>
          <span class="control-value">${remoteControl}</span>
        </div>
        
        <div class="control-item">
          <span class="control-label">🫧 Bubble Soak</span>
          <span class="control-value">${bubbleSoak}</span>
        </div>
        
        <div class="control-item">
          <span class="control-label">🧴 Detergent</span>
          <span class="control-value">${detergentAmount}</span>
        </div>
        
        <div class="control-item">
          <span class="control-label">🔄 Rinse Cycles</span>
          <span class="control-value">${rinseCycles}</span>
        </div>
        
        <div class="control-item">
          <span class="control-label">🌪️ Spin Level</span>
          <span class="control-value">${spinLevel} RPM</span>
        </div>
      </div>
    </div>
  `;
}
