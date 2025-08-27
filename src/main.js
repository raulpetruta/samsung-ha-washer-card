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
      rows: 12,
      columns: 12,
      min_rows: 8,
      max_rows: 20,
    };
  }

  // Return the visual editor for the card configuration
  static getConfigElement() {
    return document.createElement("samsung-washer-card-editor");
  }

  // Return the stub configuration for the card
  static getStubConfig() {
    return {
      device_name: "select.washing_machine",
      icon: "🧺",
      complete_status_for_x_hours: 2,
      grid_columns: 12,
      grid_rows: 12,
      min_rows: 8,
      max_rows: 20
    };
  }
}

// Configuration Editor Class
class SamsungWasherCardEditor extends HTMLElement {
  setConfig(config) {
    this.config = { ...config };
  }

  configChanged(newConfig) {
    const event = new Event("config-changed", {
      bubbles: true,
      composed: true,
    });
    event.detail = { config: newConfig };
    this.dispatchEvent(event);
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
            <input
              type="text"
              class="config-input"
              .value="${this.config.device_name || ''}"
              @input="${this._valueChanged}"
              data-config-key="device_name"
              placeholder="e.g., washing_machine"
            />
          </div>
          <div class="config-help">The name of your Samsung washer device in Home Assistant</div>

          <div class="config-row">
            <label class="config-label">Icon:</label>
            <input
              type="text"
              class="config-input"
              .value="${this.config.icon || ''}"
              @input="${this._valueChanged}"
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
              .value="${this.config.complete_status_for_x_hours || 2}"
              @input="${this._valueChanged}"
              data-config-key="complete_status_for_x_hours"
              min="1"
              max="24"
            />
          </div>
          <div class="config-help">Hours to show green "completed" status after washing is done</div>
        </div>

        <div class="config-section">
          <div class="config-section-title">Grid Layout Options</div>
          
          <div class="config-row">
            <label class="config-label">Grid Columns:</label>
            <input
              type="number"
              class="config-input"
              .value="12"
              @input="${this._valueChanged}"
              data-config-key="grid_columns"
              min="1"
              max="12"
            />
          </div>
          <div class="config-help">Number of columns the card should span (1-12, default: 12 for full width)</div>

          <div class="config-row">
            <label class="config-label">Grid Rows:</label>
            <input
              type="number"
              class="config-input"
              .value="${this.config.grid_rows || 12}"
              @input="${this._valueChanged}"
              data-config-key="grid_rows"
              min="8"
              max="24"
            />
          </div>
          <div class="config-help">Number of rows the card should span (8-24, default: 12)</div>

          <div class="config-row">
            <label class="config-label">Minimum Rows:</label>
            <input
              type="number"
              class="config-input"
              .value="${this.config.min_rows || 8}"
              @input="${this._valueChanged}"
              data-config-key="min_rows"
              min="4"
              max="20"
            />
          </div>
          <div class="config-help">Minimum number of rows (4-20, default: 8)</div>

          <div class="config-row">
            <label class="config-label">Maximum Rows:</label>
            <input
              type="number"
              class="config-input"
              .value="${this.config.max_rows || 20}"
              @input="${this._valueChanged}"
              data-config-key="max_rows"
              min="12"
              max="30"
            />
          </div>
          <div class="config-help">Maximum number of rows (12-30, default: 20)</div>
        </div>
      </div>
    `;
  }

  _valueChanged(ev) {
    if (!this.config || !ev.target) {
      return;
    }

    const target = ev.target;
    const key = target.dataset.configKey;
    
    if (!key) {
      return;
    }

    let value = target.value;
    
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
