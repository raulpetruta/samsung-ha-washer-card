class SamsungWasherCard extends HTMLElement {
    set hass(hass) {
    // Store hass reference for use in other methods
    this.currentHass = hass;
    
    if (!this.content) {
        this.innerHTML = `
          <ha-card>
            <div class="card-content"></div>
            <style>
              ha-card {
                background: var(--card-background-color, rgb(245, 245, 247));
                border-radius: 16px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                color: var(--primary-text-color, rgb(55, 65, 81));
                overflow: hidden;
                border: 1px solid rgba(0, 174, 199, 0.1);
                transition: all 0.3s ease;
              }
              
              @media (prefers-color-scheme: dark) {
                ha-card {
                  background: rgb(36, 36, 42);
                  color: rgb(229, 231, 235);
                  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
                  border: 1px solid rgba(0, 191, 214, 0.2);
                }
              }
              
              .card-content {
                padding: 24px;
              }
              .washer-header {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 2px solid var(--accent-color, rgb(0, 174, 199));
              }
              
              @media (prefers-color-scheme: dark) {
                .washer-header {
                  border-bottom-color: rgb(0, 191, 214);
                }
              }
              
              .washer-icon {
                width: 48px;
                height: 48px;
                background: var(--accent-color, rgb(0, 174, 199));
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: white;
              }
              
              .washer-icon ha-icon {
                --mdc-icon-size: 24px;
                color: white;
              }
              
              @media (prefers-color-scheme: dark) {
                .washer-icon {
                  background: rgb(0, 191, 214);
                }
              }
              
              .washing-machine {
                width: 120px;
                height: 140px;
                margin: 0 auto 20px;
                position: relative;
              }
              
              .machine-body {
                width: 100%;
                height: 100%;
                background: var(--card-background-color, rgb(245, 245, 247));
                border: 3px solid var(--accent-color, rgb(0, 174, 199));
                border-radius: 12px;
                position: relative;
                box-shadow: 0 4px 12px rgba(0, 174, 199, 0.2);
              }
              
              @media (prefers-color-scheme: dark) {
                .machine-body {
                  background: rgb(50, 50, 56);
                  border-color: rgb(0, 191, 214);
                  box-shadow: 0 4px 12px rgba(0, 191, 214, 0.3);
                }
              }
              
              .machine-door {
                width: 70px;
                height: 70px;
                border: 4px solid var(--accent-color, rgb(0, 174, 199));
                border-radius: 50%;
                position: absolute;
                top: 25px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 174, 199, 0.1);
                overflow: hidden;
              }
              
              @media (prefers-color-scheme: dark) {
                .machine-door {
                  border-color: rgb(0, 191, 214);
                  background: rgba(0, 191, 214, 0.15);
                }
              }
              
              .drum {
                width: 50px;
                height: 50px;
                border: 2px solid rgba(0, 174, 199, 0.3);
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent 50%);
              }
              
              @media (prefers-color-scheme: dark) {
                .drum {
                  border-color: rgba(0, 191, 214, 0.4);
                  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1), transparent 50%);
                }
              }
              
              .drum::before {
                content: '';
                position: absolute;
                width: 8px;
                height: 8px;
                background: var(--accent-color, rgb(0, 174, 199));
                border-radius: 50%;
                top: 8px;
                left: 20px;
              }
              
              .drum::after {
                content: '';
                position: absolute;
                width: 6px;
                height: 6px;
                background: var(--accent-color, rgb(0, 174, 199));
                border-radius: 50%;
                bottom: 12px;
                right: 15px;
              }
              
              @media (prefers-color-scheme: dark) {
                .drum::before,
                .drum::after {
                  background: rgb(0, 191, 214);
                }
              }
              
              .water {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 0;
                background: linear-gradient(to top, rgba(0, 174, 199, 0.6), rgba(0, 174, 199, 0.2));
                border-radius: 50%;
                transition: height 0.5s ease;
              }
              
              @media (prefers-color-scheme: dark) {
                .water {
                  background: linear-gradient(to top, rgba(0, 191, 214, 0.7), rgba(0, 191, 214, 0.3));
                }
              }
              
              .control-panel {
                position: absolute;
                bottom: 15px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 6px;
              }
              
              .control-button {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--accent-color, rgb(0, 174, 199));
                opacity: 0.6;
              }
              
              @media (prefers-color-scheme: dark) {
                .control-button {
                  background: rgb(0, 191, 214);
                }
              }
              
              .status-light {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                position: absolute;
                top: 8px;
                right: 12px;
                background: var(--accent-color, rgb(0, 174, 199));
                opacity: 0.8;
                transition: all 0.3s ease;
              }
              
              @media (prefers-color-scheme: dark) {
                .status-light {
                  background: rgb(0, 191, 214);
                }
              }
              
              .status-light.idle {
                background: var(--accent-color, rgb(0, 174, 199));
              }
              
              @media (prefers-color-scheme: dark) {
                .status-light.idle {
                  background: rgb(0, 191, 214);
                }
              }
              
              .status-light.completed {
                background: var(--progress-color, rgb(88, 214, 141));
              }
              
              @media (prefers-color-scheme: dark) {
                .status-light.completed {
                  background: rgb(76, 201, 123);
                }
              }
              
              .status-light.running {
                background: var(--warning-color, rgb(255, 179, 71));
              }
              
              @media (prefers-color-scheme: dark) {
                .status-light.running {
                  background: rgb(255, 171, 64);
                }
              }
              
              /* Animations */
              .running .drum {
                animation: spin 2s linear infinite;
              }
              
              .running .water {
                height: 60%;
                animation: waterBubble 3s ease-in-out infinite;
              }
              
              .running .status-light {
                animation: pulse 1.5s ease-in-out infinite;
              }
              
              .completed .status-light {
                animation: completePulse 0.8s ease-in-out 3;
              }
              
              @keyframes spin {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to { transform: translate(-50%, -50%) rotate(360deg); }
              }
              
              @keyframes waterBubble {
                0%, 100% { height: 55%; }
                50% { height: 65%; }
              }
              
              @keyframes pulse {
                0%, 100% { opacity: 0.8; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
              }
              
              @keyframes completePulse {
                0%, 100% { opacity: 0.8; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.3); }
              }
              
              .washer-title {
                flex: 1;
              }
              .washer-name {
                font-size: 24px;
                font-weight: 600;
                margin: 0;
                color: var(--primary-text-color, rgb(55, 65, 81));
              }
              
              @media (prefers-color-scheme: dark) {
                .washer-name {
                  color: rgb(229, 231, 235);
                }
              }
              
              .washer-status {
                font-size: 14px;
                opacity: 0.8;
                margin: 4px 0 0 0;
              }
              .status-badge {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: white;
              }
              .status-running {
                background: var(--warning-color, rgb(255, 179, 71));
              }
              .status-stopped {
                background: var(--progress-color, rgb(88, 214, 141));
              }
              .status-idle {
                background: var(--accent-color, rgb(0, 174, 199));
              }
              
              @media (prefers-color-scheme: dark) {
                .status-running {
                  background: rgb(255, 171, 64);
                }
                .status-stopped {
                  background: rgb(76, 201, 123);
                }
                .status-idle {
                  background: rgb(0, 191, 214);
                }
              }
              
              .sensors-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
                margin-top: 20px;
              }
              
              @media (max-width: 768px) {
                .sensors-grid {
                  grid-template-columns: repeat(2, 1fr);
                }
              }
              
              @media (max-width: 480px) {
                .sensors-grid {
                  grid-template-columns: 1fr;
                }
              }
              .sensor-card {
                background: rgba(0, 174, 199, 0.05);
                border: 1px solid rgba(0, 174, 199, 0.15);
                border-radius: 12px;
                padding: 12px;
                transition: all 0.3s ease;
                min-height: 80px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              }
              
              .sensor-card:hover {
                background: rgba(0, 174, 199, 0.08);
                border-color: rgba(0, 174, 199, 0.25);
                transform: translateY(-2px);
              }
              
              @media (prefers-color-scheme: dark) {
                .sensor-card {
                  background: rgba(0, 191, 214, 0.08);
                  border-color: rgba(0, 191, 214, 0.2);
                }
                
                .sensor-card:hover {
                  background: rgba(0, 191, 214, 0.12);
                  border-color: rgba(0, 191, 214, 0.3);
                }
              }
              
              .sensor-icon {
                width: 24px;
                height: 24px;
                margin-bottom: 8px;
                opacity: 0.8;
                font-size: 16px;
                flex-shrink: 0;
              }
              .sensor-label {
                font-size: 11px;
                opacity: 0.7;
                margin-bottom: 4px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--primary-text-color, rgb(55, 65, 81));
                line-height: 1.2;
              }
              
              @media (prefers-color-scheme: dark) {
                .sensor-label {
                  color: rgb(229, 231, 235);
                }
              }
              
              .sensor-value {
                font-size: 14px;
                font-weight: 600;
                line-height: 1.2;
                color: var(--primary-text-color, rgb(55, 65, 81));
                word-break: break-word;
              }
              
              @media (prefers-color-scheme: dark) {
                .sensor-value {
                  color: rgb(229, 231, 235);
                }
              }
              
              .controls-section {
                margin-top: 20px;
                padding-top: 16px;
                border-top: 2px solid var(--accent-color, rgb(0, 174, 199));
              }
              
              @media (prefers-color-scheme: dark) {
                .controls-section {
                  border-top-color: rgb(0, 191, 214);
                }
              }
              
              .controls-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
                margin-top: 12px;
              }
              
              @media (max-width: 480px) {
                .controls-grid {
                  grid-template-columns: 1fr;
                }
              }
              
              .controls-title {
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 12px;
                color: var(--primary-text-color, rgb(55, 65, 81));
              }
              
              @media (prefers-color-scheme: dark) {
                .controls-title {
                  color: rgb(229, 231, 235);
                }
              }
              
              .control-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                margin: 0;
                background: rgba(0, 174, 199, 0.03);
                border: 1px solid rgba(0, 174, 199, 0.1);
                border-radius: 8px;
                transition: all 0.3s ease;
                min-height: 36px;
              }
              
              .control-item:hover {
                background: rgba(0, 174, 199, 0.06);
                border-color: rgba(0, 174, 199, 0.2);
              }
              
              @media (prefers-color-scheme: dark) {
                .control-item {
                  background: rgba(0, 191, 214, 0.05);
                  border-color: rgba(0, 191, 214, 0.15);
                }
                
                .control-item:hover {
                  background: rgba(0, 191, 214, 0.08);
                  border-color: rgba(0, 191, 214, 0.25);
                }
              }
              
              .control-label {
                font-size: 12px;
                color: var(--primary-text-color, rgb(55, 65, 81));
                flex: 1;
              }
              
              @media (prefers-color-scheme: dark) {
                .control-label {
                  color: rgb(229, 231, 235);
                }
              }
              
              .control-value {
                font-weight: 600;
                font-size: 12px;
                color: var(--accent-color, rgb(0, 174, 199));
                text-align: right;
              }
              
              @media (prefers-color-scheme: dark) {
                .control-value {
                  color: rgb(0, 191, 214);
                }
              }
              
              .unavailable {
                opacity: 0.5;
                color: var(--warning-color, rgb(255, 179, 71));
              }
              
              @media (prefers-color-scheme: dark) {
                .unavailable {
                  color: rgb(255, 171, 64);
                }
              }
            </style>
          </ha-card>
        `;
        this.content = this.querySelector(".card-content");
      }

            
      // Store hass reference for use in other methods
      this.currentHass = hass;
      
      // Get all the sensor entities using exact entity IDs
      const deviceName = this.config.device_name || 'washing_machine';
      
      const machineState = this.getEntityValue(hass, `sensor.${deviceName}_machine_state`, 'Unknown');
      const jobState = this.getEntityValue(hass, `sensor.${deviceName}_job_state`, 'None');
      const completionTime = this.formatCompletionTime(this.getEntityValue(hass, `sensor.${deviceName}_completion_time`, 'Unknown'));
      const energy = this.getEntityValue(hass, `sensor.${deviceName}_energy`, '0');
      const energyDiff = this.getEntityValue(hass, `sensor.${deviceName}_energy_difference`, '0');
      const energySaved = this.getEntityValue(hass, `sensor.${deviceName}_energy_saved`, '0');
      const power = this.getEntityValue(hass, `sensor.${deviceName}_power`, '0');
      const powerEnergy = this.getEntityValue(hass, `sensor.${deviceName}_power_energy`, '0');
      const waterConsumption = this.getEntityValue(hass, `sensor.${deviceName}_water_consumption`, '0');
      const childLock = this.getBinaryState(hass, `binary_sensor.${deviceName}_child_lock`);
      const remoteControl = this.getBinaryState(hass, `binary_sensor.${deviceName}_remote_control`);
      const powerBinary = this.getBinaryState(hass, `binary_sensor.${deviceName}_power`);
      const bubbleSoak = this.getSwitchState(hass, `switch.${deviceName}_bubble_soak`);
      const detergentAmount = this.getEntityValue(hass, `select.${deviceName}_detergent_dispense_amount`, 'Extra');
      const rinseCycles = this.getEntityValue(hass, `number.${deviceName}_rinse_cycles`, '2');
      const spinLevel = this.getEntityValue(hass, `select.${deviceName}_spin_level`, '1400');
      const washerSelect = this.getEntityValue(hass, `select.${deviceName}`, 'Unknown');

      // Determine status badge and animation class
      const statusClass = machineState.toLowerCase().includes('running') ? 'status-running' : 
                         machineState.toLowerCase().includes('stopped') ? 'status-stopped' : 'status-idle';
      
      // Determine if cycle recently completed based on completion time and config
      const isRecentlyCompleted = this.isRecentlyCompleted(hass);
      
      const animationClass = machineState.toLowerCase().includes('running') || machineState.toLowerCase().includes('wash') ? 'running' : 
                            isRecentlyCompleted ? 'completed' : '';
      
      const statusLightClass = machineState.toLowerCase().includes('running') || machineState.toLowerCase().includes('wash') ? 'running' : 
                              isRecentlyCompleted ? 'completed' : 'idle';

      // Format the device name for display
      const deviceDisplayName = this.formatDeviceName(this.config.device_name || 'washing_machine');
      
      // Get the icon from config or use default
      const washerIcon = this.config.icon || '🧺';
      
      // Determine if it's an MDI icon or emoji
      const iconHtml = washerIcon.includes(':') 
        ? `<ha-icon icon="${washerIcon}"></ha-icon>`
        : washerIcon;

      this.content.innerHTML = `
        <div class="washer-header">
          <div class="washer-icon">${iconHtml}</div>
          <div class="washer-title">
            <h2 class="washer-name">${deviceDisplayName}</h2>
            <p class="washer-status">
              <span class="status-badge ${statusClass}">${machineState}</span>
            </p>
          </div>
        </div>

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

        <div class="sensors-grid">
          <div class="sensor-card">
            <div class="sensor-icon">⏱️</div>
            <div class="sensor-label">Completion Time</div>
            <div class="sensor-value">${completionTime}</div>
          </div>
          
          <div class="sensor-card">
            <div class="sensor-icon">⚡</div>
            <div class="sensor-label">Energy Used</div>
            <div class="sensor-value">${energy} kWh</div>
          </div>
          
          <div class="sensor-card">
            <div class="sensor-icon">💧</div>
            <div class="sensor-label">Water Used</div>
            <div class="sensor-value">${waterConsumption} L</div>
          </div>
          
          <div class="sensor-card">
            <div class="sensor-icon">🔌</div>
            <div class="sensor-label">Power Status</div>
            <div class="sensor-value">${powerBinary}</div>
          </div>
          
          <div class="sensor-card">
            <div class="sensor-icon">⚡</div>
            <div class="sensor-label">Current Power</div>
            <div class="sensor-value">${power} W</div>
          </div>
          
          <div class="sensor-card">
            <div class="sensor-icon">💚</div>
            <div class="sensor-label">Energy Saved</div>
            <div class="sensor-value">${energySaved} kWh</div>
          </div>
          
          <div class="sensor-card">
            <div class="sensor-icon">👁️</div>
            <div class="sensor-label">Job State</div>
            <div class="sensor-value">${jobState}</div>
          </div>

          ${washerSelect !== 'Unknown' ? `
          <div class="sensor-card">
            <div class="sensor-icon">⚙️</div>
            <div class="sensor-label">Program</div>
            <div class="sensor-value">${washerSelect}</div>
          </div>
          ` : ''}
        </div>

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

    formatDeviceName(deviceName) {
      // Convert device name to a nice display format
      return deviceName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    getEntityValue(hass, entityId, defaultValue) {
      const entity = hass.states[entityId];
      if (entity && entity.state !== 'unavailable' && entity.state !== 'unknown') {
        return entity.state;
      }
      return defaultValue;
    }

    getBinaryState(hass, entityId) {
      const entity = hass.states[entityId];
      if (entity && entity.state !== 'unavailable' && entity.state !== 'unknown') {
        return entity.state === 'on' ? 'On' : 'Off';
      }
      return 'Off';
    }

    getSwitchState(hass, entityId) {
      const entity = hass.states[entityId];
      if (entity && entity.state !== 'unavailable' && entity.state !== 'unknown') {
        return entity.state === 'on' ? 'On' : 'Off';
      }
      return 'Off';
    }

    formatCompletionTime(timeStr) {
      if (timeStr === 'Unknown' || timeStr === 'unavailable') {
        return 'Unknown';
      }
      
      try {
        const date = new Date(timeStr);
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        
        if (diffMs < 0) {
          const pastDiffMs = Math.abs(diffMs);
          const hours = Math.floor(pastDiffMs / (1000 * 60 * 60));
          const minutes = Math.floor((pastDiffMs % (1000 * 60 * 60)) / (1000 * 60));
          
          if (hours > 0) {
            return `${hours}h ${minutes}m ago`;
          } else {
            return `${minutes}m ago`;
          }
        } else {
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          
          if (hours > 0) {
            return `${hours}h ${minutes}m left`;
          } else {
            return `${minutes}m left`;
          }
        }
      } catch (error) {
        return timeStr;
      }
    }

    isRecentlyCompleted(hass) {
      // Get the configured hours (default to 2 hours)
      const completeStatusHours = this.config.complete_status_for_x_hours || 2;
      
      try {
        // Get the raw completion time directly from hass
        const completionTimeRaw = this.getEntityValue(hass, `sensor.${this.config.device_name || 'washing_machine'}_completion_time`, '');
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
      return 8;
    }
  
    // The rules for sizing your card in the grid in sections view
    getGridOptions() {
      return {
        rows: 8,
        columns: 8,
        min_rows: 8,
        max_rows: 8,
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
  });