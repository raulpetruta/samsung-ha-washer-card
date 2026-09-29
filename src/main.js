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

    const sensorData = EntityHelpers.getAllSensorData(hass, this.config);
    const stage = sensorData.progress || sensorData.jobState;
    const activity = Formatters.getActivity(sensorData);
    const isRecentlyCompleted = this.isRecentlyCompleted(sensorData, activity);
    const completionSource = sensorData.completionTime
      || (isRecentlyCompleted ? this._lastFinishTime : null);
    const formattedCompletionTime = Formatters.formatCompletionTime(completionSource);

    const statusClass = Formatters.getStatusClass(activity, sensorData.machineState, stage);
    const animationClass = Formatters.getAnimationClass(activity, isRecentlyCompleted);
    const statusLightClass = Formatters.getStatusLightClass(activity, isRecentlyCompleted);

    const legacyName = Formatters.formatDeviceName(EntityHelpers.getLegacyPrefix(this.config) || 'washer');
    const deviceDisplayName = EntityHelpers.getDisplayName(hass, this.config) || legacyName;
    const isDryer = this.config.appliance === 'dryer';
    
    const washerIcon = this.config.icon || (isDryer ? 'mdi:tumble-dryer' : '🧺');
    const iconHtml = Formatters.getIconHtml(washerIcon);

    const sensorsGridData = {
      completionTime: formattedCompletionTime,
      energy: Formatters.formatSensorValue(sensorData.energy),
      energyUnit: sensorData.energyUnit,
      waterConsumption: Formatters.formatSensorValue(sensorData.waterConsumption),
      waterUnit: sensorData.waterUnit,
      powerBinary: sensorData.powerBinary,
      power: Formatters.formatSensorValue(sensorData.power),
      powerUnit: sensorData.powerUnit,
      energySaved: Formatters.formatSensorValue(sensorData.energySaved),
      energySavedUnit: sensorData.energySavedUnit,
      jobState: Formatters.formatStage(sensorData.jobState)
    };

    const shown = (key) => SamsungWasherCard.isControlShown(this.config, key);
    const controlsData = {
      showChildLock: shown('show_child_lock'),
      showRemoteControl: shown('show_remote_control'),
      showBubbleSoak: shown('show_bubble_soak'),
      showDetergent: shown('show_detergent'),
      showRinseCycles: shown('show_rinse_cycles'),
      showSpinLevel: shown('show_spin_level'),
      showWaterTemperature: shown('show_water_temperature'),
      showWrinklePrevent: shown('show_wrinkle_prevent'),
      showDryLevel: shown('show_dry_level'),
      childLock: sensorData.childLock,
      remoteControl: sensorData.remoteControl,
      bubbleSoak: sensorData.bubbleSoak,
      detergentAmount: sensorData.detergentAmount,
      rinseCycles: sensorData.rinseCycles,
      spinLevel: Formatters.formatSpin(sensorData.spinLevel),
      washTemperature: Formatters.formatTemperature(sensorData.washTemperature),
      wrinklePrevent: sensorData.wrinklePrevent,
      dryLevel: sensorData.dryLevel
    };

    const statusText = Formatters.getStatusText(sensorData);

    // Render the card
    this.content.innerHTML = `
      <div class="washer-layout">
        <div class="washer-left">
          <div class="washer-header">
            <div class="washer-icon">${iconHtml}</div>
            <div class="washer-title">
              <h2 class="washer-name">${deviceDisplayName}</h2>
              <p class="washer-status">
                <span class="status-badge ${statusClass}">${statusText}</span>
              </p>
            </div>
          </div>

          ${createWashingMachine(animationClass, statusLightClass, { hideWater: isDryer })}
        </div>
        
        <div class="washer-right">
          ${createSensorsGrid(sensorsGridData)}
          ${createControlsSection(controlsData)}
        </div>
      </div>
    `;
  }

  isRecentlyCompleted(sensorData, activity) {
    const now = Date.now();
    const remembered = Formatters.nextRememberedFinish({
      live: sensorData.completionTime,
      remembered: this._lastFinishTime,
      finishWasLive: this._finishWasLive,
      activity,
      now,
    });
    this._lastFinishTime = remembered.remembered;
    this._finishWasLive = remembered.finishWasLive;

    if (activity === 'running' || activity === 'paused') return false;
    if (Formatters.isFinishedStage(sensorData.progress || sensorData.jobState)) return true;

    const configuredHours = Number(this.config.complete_status_for_x_hours);
    const hours = Number.isFinite(configuredHours) && configuredHours > 0 ? configuredHours : 2;
    return Formatters.isWithinCompletionWindow(
      sensorData.completionTime || this._lastFinishTime,
      hours,
      now
    );
  }

  static isControlShown(config, key) {
    if (config?.[key] === true) return true;
    if (config?.[key] === false) return false;
    const isDryer = config?.appliance === 'dryer';
    const washerOnly = new Set([
      'show_bubble_soak',
      'show_detergent',
      'show_rinse_cycles',
      'show_spin_level',
      'show_water_temperature',
    ]);
    if (isDryer && washerOnly.has(key)) return false;
    if (key === 'show_wrinkle_prevent' || key === 'show_dry_level') return isDryer;
    return true;
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
      rows: 10,
      columns: 12,
      min_rows: 8,
      max_rows: 12,
      min_columns: 12,
      max_columns: 12,
    };
  }

  // Return the stub configuration for the card
  static getStubConfig(hass) {
    let defaultDeviceName = "";
    let appliance = "washer";
    if (hass?.entities) {
      const localThingsEntity = Object.keys(hass.entities).find((entityId) => {
        const entry = hass.entities[entityId];
        const key = entry?.translation_key || '';
        return entry?.platform === 'localthings' && (
          key === 'machine_state'
          || key === 'washer_cycle' || key.startsWith('washer_cycle_')
          || key === 'dryer_cycle' || key.startsWith('dryer_cycle_')
        );
      });
      if (localThingsEntity) {
        defaultDeviceName = localThingsEntity;
        const key = hass.entities[localThingsEntity]?.translation_key || '';
        if (key === 'dryer_cycle' || key.startsWith('dryer_cycle_')) appliance = "dryer";
      }
    }

    if (!defaultDeviceName && hass?.states) {
      const selectEntities = Object.keys(hass.states).filter((entity) =>
        entity.startsWith('select.') &&
        (entity.toLowerCase().includes('wash') ||
         entity.toLowerCase().includes('washer') ||
         entity.toLowerCase().includes('dryer') ||
         entity.toLowerCase().includes('laundry'))
      );
      if (selectEntities.length > 0) {
        defaultDeviceName = selectEntities[0];
        if (selectEntities[0].toLowerCase().includes('dryer')) appliance = "dryer";
      }
    }
    
    return {
      device_name: defaultDeviceName,
      appliance,
      icon: appliance === "dryer" ? "mdi:tumble-dryer" : "🧺",
      complete_status_for_x_hours: 2
    };
  }

  // Use built-in form editor with selectors
  static getConfigForm(hass, config) {
    // Convert device_name to full entity ID for the selector
    const currentEntityId = config?.device_name?.includes('.') 
      ? config.device_name 
      : (config?.device_name ? `select.${config.device_name}` : '');
    const showWasherControls = config?.appliance !== 'dryer';
    const showDryerControls = config?.appliance === 'dryer';
    
    return {
      schema: [
        {
          name: "device_name",
          required: true,
          selector: {
            entity: {
              filter: [
                { domain: "sensor" },
                { domain: "binary_sensor" },
                { domain: "switch" },
                { domain: "select" },
                { domain: "number" },
                { domain: "button" }
              ]
            }
          },
          // This is a workaround to show the current value
          default: currentEntityId
        },
        {
          name: "appliance",
          default: "washer",
          selector: {
            select: {
              options: [
                { value: "washer", label: "Washer" },
                { value: "dryer", label: "Dryer" }
              ]
            }
          }
        },
        {
          name: "completion_time_entity",
          selector: {
            entity: {
              domain: "sensor"
            }
          }
        },
        {
          name: "energy_entity",
          selector: {
            entity: {
              domain: "sensor",
              device_class: "energy"
            }
          }
        },
        {
          name: "water_entity",
          selector: {
            entity: {
              domain: "sensor"
            }
          }
        },
        {
          name: "power_binary_entity",
          selector: {
            entity: {
              domain: "binary_sensor"
            }
          }
        },
        {
          name: "power_entity",
          selector: {
            entity: {
              domain: "sensor",
              device_class: "power"
            }
          }
        },
        {
          name: "energy_saved_entity",
          selector: {
            entity: {
              domain: "sensor",
              device_class: "energy"
            }
          }
        },
        {
          name: "job_state_entity",
          selector: {
            entity: {
              domain: "sensor"
            }
          }
        },
        {
          name: "program_entity",
          selector: {
            entity: {
              domain: "select"
            }
          }
        },
        {
          name: "water_temperature_entity",
          selector: {
            entity: {
              domain: "select"
            }
          }
        },
        {
          name: "show_child_lock",
          default: true,
          selector: { boolean: {} }
        },
        {
          name: "show_remote_control",
          default: true,
          selector: { boolean: {} }
        },
        {
          name: "show_bubble_soak",
          default: showWasherControls,
          selector: { boolean: {} }
        },
        {
          name: "show_detergent",
          default: showWasherControls,
          selector: { boolean: {} }
        },
        {
          name: "show_rinse_cycles",
          default: showWasherControls,
          selector: { boolean: {} }
        },
        {
          name: "show_spin_level",
          default: showWasherControls,
          selector: { boolean: {} }
        },
        {
          name: "show_water_temperature",
          default: showWasherControls,
          selector: { boolean: {} }
        },
        {
          name: "wrinkle_prevent_entity",
          selector: {
            entity: {}
          }
        },
        {
          name: "dry_level_entity",
          selector: {
            entity: {
              domain: "select"
            }
          }
        },
        {
          name: "show_wrinkle_prevent",
          default: showDryerControls,
          selector: { boolean: {} }
        },
        {
          name: "show_dry_level",
          default: showDryerControls,
          selector: { boolean: {} }
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
          device_name: "Washer or Dryer Entity",
          appliance: "Appliance",
          completion_time_entity: "Completion Time Sensor",
          energy_entity: "Energy Sensor",
          water_entity: "Water Consumption Sensor",
          power_binary_entity: "Power Status (Binary)",
          power_entity: "Power Sensor",
          energy_saved_entity: "Energy Saved Sensor",
          job_state_entity: "Job State Sensor",
          program_entity: "Program/Cycle Select",
          water_temperature_entity: "Water Temperature Select",
          show_child_lock: "Show Child Lock",
          show_remote_control: "Show Remote Control",
          show_bubble_soak: "Show Bubble Soak",
          show_detergent: "Show Detergent",
          show_rinse_cycles: "Show Rinse Cycles",
          show_spin_level: "Show Spin Level",
          show_water_temperature: "Show Water Temperature",
          wrinkle_prevent_entity: "Wrinkle Prevent",
          dry_level_entity: "Dry Level Select",
          show_wrinkle_prevent: "Show Wrinkle Prevent",
          show_dry_level: "Show Dry Level",
          icon: "Card Icon",
          complete_status_for_x_hours: "Completed Status Duration"
        };
        return labels[schema.name];
      },
      computeHelper: (schema) => {
        const helpers = {
          device_name: "Pick any entity from the washer or dryer. LocalThings siblings are found automatically.",
          appliance: "Dryer mode hides wash-only controls and shows wrinkle prevent and dry level.",
          icon: "Icon to display in the card header (emoji or mdi:icon-name)",
          complete_status_for_x_hours: "Hours to show green 'completed' status after washing is done",
          water_temperature_entity: "Optional. LocalThings wash temperature is found automatically.",
          show_child_lock: "Hide a control by turning its switch off. Hidden controls stay available to the washer."
        };
        return helpers[schema.name];
      },
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
  description: "A modern card for Samsung washers and dryers, including LocalThings",
  documentationURL: "https://github.com/raulpetruta/samsung-ha-washer-card",
  configurable: true,
});
