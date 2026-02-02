// Base styles for the Samsung Washer Card
export const baseStyles = `
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
    padding: 16px;
    overflow-y: auto;
    max-height: 100%;
  }

  .washer-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
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

  .unavailable {
    opacity: 0.5;
    color: var(--warning-color, rgb(255, 179, 71));
  }
  
  @media (prefers-color-scheme: dark) {
    .unavailable {
      color: rgb(255, 171, 64);
    }
  }
`;
