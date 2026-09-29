// Appliance graphic. Dryers tumble with heat instead of water.
export function createWashingMachine(animationClass, statusLightClass, options = {}) {
  const isDryer = Boolean(options.hideWater);
  const machineClass = isDryer ? `${animationClass} dryer` : animationClass;
  const drumContents = isDryer
    ? `<div class="drum"></div><div class="heat"></div><div class="heat heat-late"></div>`
    : `<div class="drum"></div><div class="water"></div>`;
  const vent = isDryer ? `<div class="vent"></div>` : '';

  return `
    <div class="washing-machine ${machineClass}">
      <div class="machine-body">
        <div class="machine-door">
          ${drumContents}
        </div>
        ${vent}
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
