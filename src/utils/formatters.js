// Formatter utility functions
export class Formatters {
  
  static formatDeviceName(deviceName) {
    // Convert device name to a nice display format
    return deviceName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  static formatCompletionTime(timeStr) {
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

  static getIconHtml(icon) {
    // Determine if it's an MDI icon or emoji
    return icon.includes(':') 
      ? `<ha-icon icon="${icon}"></ha-icon>`
      : icon;
  }

  static getStatusClass(machineState) {
    if (machineState.toLowerCase().includes('running')) {
      return 'status-running';
    } else if (machineState.toLowerCase().includes('stopped')) {
      return 'status-stopped';
    } else {
      return 'status-idle';
    }
  }

  static getAnimationClass(machineState, isRecentlyCompleted) {
    if (machineState.toLowerCase().includes('running') || machineState.toLowerCase().includes('wash')) {
      return 'running';
    } else if (isRecentlyCompleted) {
      return 'completed';
    } else {
      return '';
    }
  }

  static getStatusLightClass(machineState, isRecentlyCompleted) {
    if (machineState.toLowerCase().includes('running') || machineState.toLowerCase().includes('wash')) {
      return 'running';
    } else if (isRecentlyCompleted) {
      return 'completed';
    } else {
      return 'idle';
    }
  }
}
