// Animation styles for the washing machine
export const animationStyles = `
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

  /* Dryer Styles */
  .dryer {
    width: 120px;
    height: 140px;
    margin: 0 auto 20px;
    position: relative;
  }
  
  .dryer-body {
    width: 100%;
    height: 100%;
    background: var(--card-background-color, rgb(245, 245, 247));
    border: 3px solid var(--warning-color, rgb(255, 179, 71));
    border-radius: 12px;
    position: relative;
    box-shadow: 0 4px 12px rgba(255, 179, 71, 0.2);
  }
  
  @media (prefers-color-scheme: dark) {
    .dryer-body {
      background: rgb(50, 50, 56);
      border-color: rgb(255, 171, 64);
      box-shadow: 0 4px 12px rgba(255, 171, 64, 0.3);
    }
  }
  
  .dryer-door {
    width: 70px;
    height: 70px;
    border: 4px solid var(--warning-color, rgb(255, 179, 71));
    border-radius: 50%;
    position: absolute;
    top: 25px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 179, 71, 0.1);
    overflow: hidden;
  }
  
  @media (prefers-color-scheme: dark) {
    .dryer-door {
      border-color: rgb(255, 171, 64);
      background: rgba(255, 171, 64, 0.15);
    }
  }
  
  .dryer-drum {
    width: 50px;
    height: 50px;
    border: 2px solid rgba(255, 179, 71, 0.3);
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent 50%);
  }
  
  @media (prefers-color-scheme: dark) {
    .dryer-drum {
      border-color: rgba(255, 171, 64, 0.4);
      background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1), transparent 50%);
    }
  }

  .tumble-item {
    position: absolute;
    width: 4px;
    height: 4px;
    background: var(--warning-color, rgb(255, 179, 71));
    border-radius: 50%;
  }

  .tumble-item:nth-child(1) {
    top: 10px;
    left: 15px;
  }

  .tumble-item:nth-child(2) {
    top: 25px;
    right: 10px;
  }

  .tumble-item:nth-child(3) {
    bottom: 15px;
    left: 20px;
  }

  @media (prefers-color-scheme: dark) {
    .tumble-item {
      background: rgb(255, 171, 64);
    }
  }

  .heat-indicator {
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 4px;
    background: linear-gradient(to right, transparent, rgba(255, 179, 71, 0.6), transparent);
    border-radius: 2px;
  }

  @media (prefers-color-scheme: dark) {
    .heat-indicator {
      background: linear-gradient(to right, transparent, rgba(255, 171, 64, 0.7), transparent);
    }
  }

  .lint-filter {
    position: absolute;
    bottom: 8px;
    left: 8px;
    width: 15px;
    height: 8px;
    background: rgba(255, 179, 71, 0.3);
    border: 1px solid var(--warning-color, rgb(255, 179, 71));
    border-radius: 2px;
  }

  @media (prefers-color-scheme: dark) {
    .lint-filter {
      background: rgba(255, 171, 64, 0.4);
      border-color: rgb(255, 171, 64);
    }
  }

  .dryer-controls {
    position: absolute;
    bottom: 15px;
    right: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
  }

  .dryer-knob {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--warning-color, rgb(255, 179, 71));
    border: 2px solid rgba(255, 179, 71, 0.5);
  }

  @media (prefers-color-scheme: dark) {
    .dryer-knob {
      background: rgb(255, 171, 64);
      border-color: rgba(255, 171, 64, 0.6);
    }
  }

  .dryer-display {
    width: 16px;
    height: 4px;
    background: var(--warning-color, rgb(255, 179, 71));
    border-radius: 2px;
    opacity: 0.8;
  }

  @media (prefers-color-scheme: dark) {
    .dryer-display {
      background: rgb(255, 171, 64);
    }
  }

  /* Dryer Animations */
  .running .dryer-drum {
    animation: tumble 4s linear infinite;
  }

  .running .tumble-item {
    animation: tumbleItems 4s linear infinite;
  }

  .running .heat-indicator {
    animation: heat 2s ease-in-out infinite;
  }

  .running .dryer-display {
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes tumble {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }

  @keyframes tumbleItems {
    0% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-8px) rotate(90deg); }
    50% { transform: translateY(0) rotate(180deg); }
    75% { transform: translateY(8px) rotate(270deg); }
    100% { transform: translateY(0) rotate(360deg); }
  }

  @keyframes heat {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
`;
