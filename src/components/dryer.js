// Dryer component HTML generator
export function createDryer(animationClass, statusLightClass) {
  return `
    <div class="dryer ${animationClass}">
      <div class="dryer-body">
        <div class="dryer-door">
          <div class="dryer-drum">
            <div class="tumble-item"></div>
            <div class="tumble-item"></div>
            <div class="tumble-item"></div>
          </div>
          <div class="heat-indicator"></div>
        </div>
        <div class="lint-filter"></div>
        <div class="dryer-controls">
          <div class="dryer-knob"></div>
          <div class="dryer-display"></div>
        </div>
        <div class="status-light ${statusLightClass}"></div>
      </div>
    </div>
  `;
}
