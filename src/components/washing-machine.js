// Washing machine component HTML generator
export function createWashingMachine(animationClass, statusLightClass, options = {}) {
  const machineClass = options.hideWater ? `${animationClass} dryer` : animationClass;
  return `
    <div class="washing-machine ${machineClass}">
      <div class="machine-body">
        <div class="machine-door">
          <div class="drum"></div>
          <div class="water"></div>
        </div>
        <div class="control-panel">
          <div class="control-button"></div>
          <div class="control-button"></div>
          <div class="control-button"></div>
        </div>
        <div class="status-light ${statusLightClass}"></div>
      </div>
    </div>
  `;
}
