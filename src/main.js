// Samsung Washer Card - Main entry point
// Imports
import { baseStyles } from './styles/base.js';
import { animationStyles } from './styles/animations.js';
import { responsiveStyles } from './styles/responsive.js';
import { createWashingMachine } from './components/washing-machine.js';
import { createSensorsGrid } from './components/sensors-grid.js';
import { createControlsSection } from './components/controls-section.js';
import { EntityHelpers } from './utils/entity-helpers.js';
import { Formatters } from './utils/formatters.js';

class SamsungWasherCard extends HTMLElement {
  set hass(hass) {
    // Store hass reference for use in other methods
    this.currentHass = hass;
    
    if (!this.content) {
      this.innerHTML = `
        <ha-card>
          <div class="card-content"></div>
          <style>
            ${baseStyles}
            ${animationStyles}
            ${responsiveStyles}
          </style>
        </ha-card>
      `;
      this.content = this.querySelector(".card-content");
    }

    // Get device name from config
    const deviceName = this.config.device_name || 'washing_machine';
    
    // Get all sensor data
    const sensorData = EntityHelpers.getAllSensorData(hass, deviceName);
    
    // Format completion time
    const formattedCompletionTime = Formatters.formatCompletionTime(sensorData.completionTime);
    
    // Determine status classes and animations
    const statusClass = Formatters.getStatusClass(sensorData.machineState);
    const isRecentlyCompleted = this.isRecentlyCompleted(hass);
    const animationClass = Formatters.getAnimationClass(sensorData.machineState, isRecentlyCompleted);
    const statusLightClass = Formatters.getStatusLightClass(sensorData.machineState, isRecentlyCompleted);

    // Format display name and icon
    const deviceDisplayName = Formatters.formatDeviceName(deviceName);
    const washerIcon = this.config.icon || '🧺';
    const iconHtml = Formatters.getIconHtml(washerIcon);

    // Prepare data for components
    const sensorsGridData = {
      completionTime: formattedCompletionTime,
      energy: sensorData.energy,
      waterConsumption: sensorData.waterConsumption,
      powerBinary: sensorData.powerBinary,
      power: sensorData.power,
      energySaved: sensorData.energySaved,
      jobState: sensorData.jobState,
      washerSelect: sensorData.washerSelect
    };

    const controlsData = {
      childLock: sensorData.childLock,
      remoteControl: sensorData.remoteControl,
      bubbleSoak: sensorData.bubbleSoak,
      detergentAmount: sensorData.detergentAmount,
      rinseCycles: sensorData.rinseCycles,
      spinLevel: sensorData.spinLevel
    };

    // Render the card
    this.content.innerHTML = `
      <div class="washer-header">
        <div class="washer-icon">${iconHtml}</div>
        <div class="washer-title">
          <h2 class="washer-name">${deviceDisplayName}</h2>
          <p class="washer-status">
            <span class="status-badge ${statusClass}">${sensorData.machineState}</span>
          </p>
        </div>
      </div>

      ${createWashingMachine(animationClass, statusLightClass)}
      ${createSensorsGrid(sensorsGridData)}
      ${createControlsSection(controlsData)}
    `;
  }

  isRecentlyCompleted(hass) {
    // Get the configured hours (default to 2 hours)
    const completeStatusHours = this.config.complete_status_for_x_hours || 2;
    
    try {
      // Get the raw completion time directly from hass
      const completionTimeRaw = EntityHelpers.getEntityValue(hass, `sensor.${this.config.device_name || 'washing_machine'}_completion_time`, '');
      if (!completionTimeRaw || completionTimeRaw === 'Unknown' || completionTimeRaw === 'unavailable') {
        return false;
      }
      
      const completionDate = new Date(completionTimeRaw);
      const now = new Date();
      const diffMs = now.getTime() - completionDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      // If completion was in the past and within the configured hours, show as completed
      return diffMs > 0 && diffHours <= completeStatusHours;
    } catch (error) {
      return false;
    }
  }

  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config) {
    if (!config.entity_prefix && !config.device_name) {
      throw new Error("You need to define either entity_prefix or device_name");
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns in masonry view
  getCardSize() {
    return 12;
  }

  // The rules for sizing your card in the grid in sections view
  getGridOptions() {
    return {
      rows: 8,
      columns: 4,
      min_rows: 6,
      max_rows: 12,
    };
  }

  // Return the visual editor for the card configuration
  static getConfigElement() {
    return document.createElement("samsung-washer-card-editor");
  }

  // Return the stub configuration for the card
  static getStubConfig() {
    return {
      device_name: "washing_machine",
      icon: "🧺",
      complete_status_for_x_hours: 2
    };
  }
}

// Configuration Editor Class
class SamsungWasherCardEditor extends HTMLElement {
  setConfig(config) {
    this.config = { ...config };
    this.render();
  }

  configChanged(newConfig) {
    const event = new Event("config-changed", {
      bubbles: true,
      composed: true,
    });
    event.detail = { config: newConfig };
    this.dispatchEvent(event);
  }

  _getPickerValue() {
    if (!this.config.device_name) return '';
    if (this.config.device_name.includes('.')) return this.config.device_name;
    return `select.${this.config.device_name}`;
  }

  render() {
    if (!this.config) {
      return;
    }

    this.innerHTML = `
      <div class="card-config">
        <style>
          .card-config {
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 16px;
          }
          .config-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
          }
          .config-label {
            font-weight: 500;
            min-width: 140px;
          }
          .config-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
          }
          .config-section {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 16px;
            margin: 8px 0;
          }
          .config-section-title {
            font-weight: 600;
            margin-bottom: 12px;
            color: #1976d2;
          }
          .config-help {
            font-size: 12px;
            color: #666;
            margin-top: 4px;
          }
        </style>

        <div class="config-section">
          <div class="config-section-title">Device Configuration</div>
          
          <div class="config-row">
            <label class="config-label">Device Name:</label>
            <ha-selector
              class="config-input"
              .hass="${this._hass}"
              .selector="${{entity: {filter: {domain: 'select'}}}}"
              .value="${this._getPickerValue()}"
              .label="Device Entity"
              @value-changed="${this._valueChanged}"
              .configValue="${'device_name'}"
            ></ha-selector>
          </div>
          <div class="config-help">Select your washer device (e.g., select.washing_machine)</div>

          <div class="config-row">
            <label class="config-label">Icon:</label>
            <input
              type="text"
              class="config-input"
              value="${this.config.icon || ''}"
              data-config-key="icon"
              placeholder="🧺 or mdi:washing-machine"
            />
          </div>
          <div class="config-help">Emoji or Material Design Icon (e.g., mdi:washing-machine)</div>

          <div class="config-row">
            <label class="config-label">Complete Status Duration (hours):</label>
            <input
              type="number"
              class="config-input"
              value="${this.config.complete_status_for_x_hours || 2}"
              data-config-key="complete_status_for_x_hours"
              min="1"
              max="24"
            />
          </div>
          <div class="config-help">Hours to show green "completed" status after washing is done</div>
        </div>
      </div>
    `;
    
    // Setup ha-selector
    const selector = this.querySelector('ha-selector');
    if (selector && this._hass) {
      selector.hass = this._hass;
      selector.value = this._getPickerValue();
      selector.selector = {entity: {filter: {domain: 'select'}}};
    }

    // Setup other inputs
    const inputs = this.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('input', this._valueChanged.bind(this));
    });
  }

  _valueChanged(ev) {
    if (!this.config || !ev.target) {
      return;
    }

    const target = ev.target;
    const key = target.dataset.configKey || target.configValue;
    
    if (!key) {
      return;
    }

    let value = target.value;
    
    // Handle ha-entity-picker value
    if (ev.detail && ev.detail.value !== undefined) {
      value = ev.detail.value;
    }
    
    // Special handling for device_name from picker
    if (key === 'device_name' && value.includes('.')) {
      value = value.split('.').pop();
    }
    
    // Convert numbers
    if (target.type === 'number') {
      value = parseInt(value) || 0;
    }

    // Update config
    const newConfig = { ...this.config };
    newConfig[key] = value;

    this.config = newConfig;
    this.configChanged(newConfig);
  }

  set hass(hass) {
    this._hass = hass;
    const selector = this.querySelector('ha-selector');
    if (selector) {
      selector.hass = hass;
    } else if (!this.hasRendered) {
      this.hasRendered = true;
      this.render();
    }
  }

  connectedCallback() {
    this.render();
  }
}

customElements.define("samsung-washer-card", SamsungWasherCard);
customElements.define("samsung-washer-card-editor", SamsungWasherCardEditor);

// Register the card with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: "samsung-washer-card",
  name: "Samsung Washer Card",
  preview: true,
  description: "A modern card for Samsung washing machines with SmartThings integration",
  documentationURL: "https://github.com/raulpetruta/samsung-ha-washer-card",
  configurable: true,
});
