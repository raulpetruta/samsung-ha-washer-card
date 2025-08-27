// Responsive styles for sensors and controls
export const responsiveStyles = `
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
`;
