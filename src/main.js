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

    // Get device name from config - handle both full entity ID and device name
    let deviceName = this.config.device_name || 'washing_machine';
    if (deviceName.includes('.')) {
      // Extract device name from full entity ID (e.g., "select.washing_machine" -> "washing_machine")
      deviceName = deviceName.split('.').pop();
    }
    
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
      // Get device name - handle both full entity ID and device name
      let deviceName = this.config.device_name || 'washing_machine';
      if (deviceName.includes('.')) {
        deviceName = deviceName.split('.').pop();
      }
      
      // Get the raw completion time directly from hass
      const completionTimeRaw = EntityHelpers.getEntityValue(hass, `sensor.${deviceName}_completion_time`, '');
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

  // Return the stub configuration for the card
  static getStubConfig(hass) {
    // Try to auto-detect a select entity that looks like a washing machine
    let defaultEntity = "";
    if (hass) {
      const selectEntities = Object.keys(hass.states).filter(entity => 
        entity.startsWith('select.') && 
        (entity.includes('wash') || entity.includes('washing'))
      );
      if (selectEntities.length > 0) {
        defaultEntity = selectEntities[0];
      } else {
        // Fallback to any select entity
        const anySelect = Object.keys(hass.states).find(entity => entity.startsWith('select.'));
        defaultEntity = anySelect || "select.washing_machine";
      }
    }
    
    return {
      device_name: defaultEntity || "select.washing_machine",
      icon: "🧺",
      complete_status_for_x_hours: 2
    };
  }

  // Use built-in form editor with selectors
  static getConfigForm(hass, config) {
    return {
      schema: [
        {
          name: "device_name",
          required: true,
          selector: {
            entity: {
              filter: {
                domain: "select"
              }
            }
          }
        },
        {
          name: "icon",
          selector: {
            icon: {}
          }
        },
        {
          name: "complete_status_for_x_hours",
          default: 2,
          selector: {
            number: {
              min: 1,
              max: 24,
              mode: "box",
              unit_of_measurement: "hours"
            }
          }
        }
      ],
      computeLabel: (schema) => {
        const labels = {
          device_name: "Washer Device",
          icon: "Card Icon",
          complete_status_for_x_hours: "Completed Status Duration"
        };
        return labels[schema.name];
      },
      computeHelper: (schema) => {
        const helpers = {
          device_name: "Select your Samsung washing machine control entity",
          icon: "Icon to display in the card header (emoji or mdi:icon-name)",
          complete_status_for_x_hours: "Hours to show green 'completed' status after washing is done"
        };
        return helpers[schema.name];
      },
      assertConfig: (config) => {
        if (config.device_name && !config.device_name.includes('.')) {
          // Auto-convert old format to new format
          config.device_name = `select.${config.device_name}`;
        }
      }
    };
  }
}

customElements.define("samsung-washer-card", SamsungWasherCard);

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
