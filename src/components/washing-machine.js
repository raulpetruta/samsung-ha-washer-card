// Washing machine component HTML generator
export function createWashingMachine(animationClass, statusLightClass) {
  return `
    <div class="washing-machine ${animationClass}">
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
