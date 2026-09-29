// Controls section component HTML generator
export function createControlsSection(controlsData) {
  const items = [
    { show: controlsData.showChildLock, label: '🔒 Child Lock', value: controlsData.childLock },
    { show: controlsData.showRemoteControl, label: '📱 Remote Control', value: controlsData.remoteControl },
    { show: controlsData.showBubbleSoak, label: '🫧 Bubble Soak', value: controlsData.bubbleSoak },
    { show: controlsData.showDetergent, label: '🧴 Detergent', value: controlsData.detergentAmount },
    { show: controlsData.showRinseCycles, label: '🔄 Rinse Cycles', value: controlsData.rinseCycles },
    { show: controlsData.showSpinLevel, label: '🌪️ Spin Level', value: controlsData.spinLevel },
    { show: controlsData.showWaterTemperature, label: '🌡️ Temperature', value: controlsData.washTemperature },
  ].filter((item) => item.show !== false);

  if (!items.length) return '';

  const displayValue = (value) => (value == null || value === '' ? '—' : value);

  return `
    <div class="controls-section">
      <div class="controls-title">Configuration & Controls</div>
      
      <div class="controls-grid">
        ${items.map((item) => `
        <div class="control-item">
          <span class="control-label">${item.label}</span>
          <span class="control-value">${displayValue(item.value)}</span>
        </div>
        `).join('')}
      </div>
    </div>
  `;
}
