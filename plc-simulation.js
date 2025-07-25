// PLC I/O Simulation System
// Industrial Maintenance Training - Worksheet 4

// PLC System State
let plcData = {
  // Digital I/O States
  digitalInputs: {
    'DI_0': { name: 'Emergency Stop', state: false, fault: false, description: 'E-Stop Button' },
    'DI_1': { name: 'Float Switch High', state: false, fault: false, description: 'High Level Float' },
    'DI_2': { name: 'Float Switch Low', state: true, fault: false, description: 'Low Level Float' },
    'DI_3': { name: 'Reset Button', state: false, fault: false, description: 'System Reset' },
    'DI_4': { name: 'Flow Sensor', state: false, fault: false, description: 'Flow Detection' },
    'DI_5': { name: 'Proximity Switch', state: false, fault: false, description: 'Lid Position' },
    'DI_6': { name: 'Pump Run Feedback', state: false, fault: false, description: 'Pump Status' },
    'DI_7': { name: 'Valve Position', state: false, fault: false, description: 'Valve Status' }
  },
  
  digitalOutputs: {
    'DO_0': { name: 'Pump Control', state: false, fault: false, description: 'Pump Start/Stop' },
    'DO_1': { name: 'Valve Control', state: false, fault: false, description: 'Valve Open/Close' },
    'DO_2': { name: 'Alarm Horn', state: false, fault: false, description: 'Audible Alarm' },
    'DO_3': { name: 'Status Light', state: false, fault: false, description: 'System Status' },
    'DO_4': { name: 'Cooling Fan', state: false, fault: false, description: 'Temperature Control' },
    'DO_5': { name: 'Drain Valve', state: false, fault: false, description: 'Tank Drain' }
  },
  
  // Analog I/O States
  analogInputs: {
    'AI_0': { name: 'Temperature Sensor', value: 25.0, unit: '°C', fault: false, description: 'Tank Temperature' },
    'AI_1': { name: 'Flow Rate', value: 0.0, unit: 'L/min', fault: false, description: 'Flow Measurement' },
    'AI_2': { name: 'Pressure Sensor', value: 1.2, unit: 'bar', fault: false, description: 'System Pressure' },
    'AI_3': { name: 'Level Sensor', value: 45.0, unit: '%', fault: false, description: 'Tank Level' }
  },
  
  analogOutputs: {
    'AO_0': { name: 'Pump Speed', value: 0.0, unit: '%', fault: false, description: 'PWM Control' },
    'AO_1': { name: 'Valve Position', value: 0.0, unit: '%', fault: false, description: 'Valve Control' }
  },
  
  // Ladder Logic States
  ladderLogic: {
    rung1: { name: 'System Start', active: false, conditions: ['DI_3', '!DI_0', 'DI_2'], output: 'DO_0' },
    rung2: { name: 'Flow Control', active: false, conditions: ['DO_0', 'AI_1'], output: 'DO_1' },
    rung3: { name: 'Temperature Control', active: false, conditions: ['AI_0'], output: 'DO_4' },
    rung4: { name: 'Alarm System', active: false, conditions: ['!DI_2', 'DI_0'], output: 'DO_2' }
  },
  
  // System Status
  systemStatus: 'stopped',
  scanTime: 10, // milliseconds
  faultHistory: [],
  maintenanceMode: false,
  
  // Simulation Control
  autoMode: false,
  simulationInterval: null,
  faultInjectionInterval: null,
  
  // Performance Tracking
  diagnosticTime: 0,
  correctDiagnoses: 0,
  totalDiagnoses: 0
};

// Initialize PLC Simulation
function initializePLCSimulation() {
  console.log('Initializing PLC I/O simulation...');
  
  // Initialize I/O display
  initializeIODisplay();
  
  // Initialize control panel
  initializePLCControls();
  
  // Initialize ladder logic display
  initializeLadderLogic();
  
  // Initialize fault injection
  initializeFaultInjection();
  
  // Initialize signal tracing
  initializeSignalTracing();
  
  // Start monitoring
  startPLCMonitoring();
  
  console.log('PLC I/O simulation initialized');
}

// Initialize I/O Display
function initializeIODisplay() {
  const ioContainer = document.getElementById('plc-io-panel');
  if (!ioContainer) return;
  
  ioContainer.innerHTML = `
    <div class="plc-io-display" style="background: #1a1a1a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #2196F3; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-microchip"></i> PLC I/O Status
      </h4>
      
      <div class="io-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
        <!-- Digital Inputs -->
        <div class="digital-inputs">
          <h5 style="color: #4CAF50; margin-bottom: 15px; font-size: 16px;">
            <i class="fas fa-sign-in-alt"></i> Digital Inputs
          </h5>
          <div id="digital-inputs-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            <!-- Digital inputs will be generated here -->
          </div>
        </div>
        
        <!-- Digital Outputs -->
        <div class="digital-outputs">
          <h5 style="color: #FF9800; margin-bottom: 15px; font-size: 16px;">
            <i class="fas fa-sign-out-alt"></i> Digital Outputs
          </h5>
          <div id="digital-outputs-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            <!-- Digital outputs will be generated here -->
          </div>
        </div>
      </div>
      
      <!-- Analog I/O Section -->
      <div class="analog-io-section" style="margin-top: 25px;">
        <h5 style="color: #9C27B0; margin-bottom: 15px; font-size: 16px;">
          <i class="fas fa-chart-line"></i> Analog I/O
        </h5>
        <div class="analog-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
          <!-- Analog Inputs -->
          <div class="analog-inputs">
            <h6 style="color: #4CAF50; margin-bottom: 10px;">Analog Inputs</h6>
            <div id="analog-inputs-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
              <!-- Analog inputs will be generated here -->
            </div>
          </div>
          
          <!-- Analog Outputs -->
          <div class="analog-outputs">
            <h6 style="color: #FF9800; margin-bottom: 10px;">Analog Outputs</h6>
            <div id="analog-outputs-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
              <!-- Analog outputs will be generated here -->
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  updateIODisplay();
}

// Initialize PLC Controls
function initializePLCControls() {
  const controlContainer = document.getElementById('plc-control-panel');
  if (!controlContainer) return;
  
  controlContainer.innerHTML = `
    <div class="plc-controls" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #2196F3; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-cogs"></i> PLC Control Panel
      </h4>
      
      <div class="control-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <!-- System Control -->
        <div class="control-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">System Control</h5>
          <div style="display: flex; gap: 10px; margin-bottom: 10px;">
            <button id="plc-start-btn" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; flex: 1;">
              <i class="fas fa-play"></i> START
            </button>
            <button id="plc-stop-btn" style="background: #F44336; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; flex: 1;">
              <i class="fas fa-stop"></i> STOP
            </button>
          </div>
          <div style="color: #FFFFFF; font-size: 12px;">
            Status: <span id="plc-system-status" style="color: #FF9800; font-weight: bold;">STOPPED</span>
          </div>
        </div>
        
        <!-- Manual Input Control -->
        <div class="control-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Manual Input Control</h5>
          <div id="manual-input-controls" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <!-- Manual input controls will be generated here -->
          </div>
        </div>
        
        <!-- Analog Control -->
        <div class="control-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 15px;">Analog Control</h5>
          <div id="analog-controls" style="display: grid; gap: 10px;">
            <!-- Analog controls will be generated here -->
          </div>
        </div>
      </div>
      
      <!-- System Information -->
      <div class="system-info" style="background: #222; padding: 15px; border-radius: 8px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
          <div>
            <span style="color: #AAA; font-size: 12px;">Scan Time:</span>
            <div id="plc-scan-time" style="color: #FFFFFF; font-weight: bold;">10ms</div>
          </div>
          <div>
            <span style="color: #AAA; font-size: 12px;">Active Rungs:</span>
            <div id="plc-active-rungs" style="color: #4CAF50; font-weight: bold;">0</div>
          </div>
          <div>
            <span style="color: #AAA; font-size: 12px;">Faults:</span>
            <div id="plc-fault-count" style="color: #F44336; font-weight: bold;">0</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  document.getElementById('plc-start-btn')?.addEventListener('click', startPLCSystem);
  document.getElementById('plc-stop-btn')?.addEventListener('click', stopPLCSystem);
  
  generateManualInputControls();
  generateAnalogControls();
}

// Initialize Ladder Logic Display
function initializeLadderLogic() {
  const ladderContainer = document.getElementById('ladder-logic-panel');
  if (!ladderContainer) return;
  
  ladderContainer.innerHTML = `
    <div class="ladder-logic-display" style="background: #1a1a1a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #2196F3; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-project-diagram"></i> Ladder Logic
      </h4>
      
      <div class="ladder-rungs" id="ladder-rungs-container" style="display: grid; gap: 15px;">
        <!-- Ladder rungs will be generated here -->
      </div>
      
      <!-- Signal Trace Panel -->
      <div class="signal-trace-panel" style="background: #2a2a2a; border-radius: 8px; padding: 15px; margin-top: 20px;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Signal Trace</h5>
        <div id="signal-trace-display" style="background: #333; padding: 10px; border-radius: 5px; min-height: 100px; font-family: monospace; font-size: 12px; color: #FFFFFF;">
          Click on any I/O point to trace its signal path...
        </div>
      </div>
    </div>
  `;
  
  generateLadderRungs();
}

// Initialize Fault Injection
function initializeFaultInjection() {
  const faultContainer = document.getElementById('plc-fault-panel');
  if (!faultContainer) return;
  
  faultContainer.innerHTML = `
    <div class="fault-injection-panel" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #F44336; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-exclamation-triangle"></i> Fault Injection
      </h4>
      
      <div class="fault-controls" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
        <div class="fault-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 10px;">Input Faults</h5>
          <div id="input-fault-controls" style="display: grid; gap: 8px;">
            <!-- Input fault controls will be generated here -->
          </div>
        </div>
        
        <div class="fault-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 10px;">Output Faults</h5>
          <div id="output-fault-controls" style="display: grid; gap: 8px;">
            <!-- Output fault controls will be generated here -->
          </div>
        </div>
        
        <div class="fault-group" style="background: #333; padding: 15px; border-radius: 8px;">
          <h5 style="color: #FFFFFF; margin-bottom: 10px;">Analog Faults</h5>
          <div id="analog-fault-controls" style="display: grid; gap: 8px;">
            <!-- Analog fault controls will be generated here -->
          </div>
        </div>
      </div>
      
      <!-- Auto Fault Injection -->
      <div class="auto-fault-controls" style="background: #333; padding: 15px; border-radius: 8px;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Automatic Fault Injection</h5>
        <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 10px;">
          <button id="start-auto-faults" style="background: #F44336; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
            <i class="fas fa-play"></i> Start Auto Faults
          </button>
          <button id="stop-auto-faults" style="background: #666; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
            <i class="fas fa-stop"></i> Stop Auto Faults
          </button>
          <span style="color: #AAA; font-size: 12px;">Interval: 30 seconds</span>
        </div>
        <div style="color: #FFFFFF; font-size: 12px;">
          Next fault in: <span id="next-fault-timer" style="color: #FF9800; font-weight: bold;">--</span>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  document.getElementById('start-auto-faults')?.addEventListener('click', startAutoFaultInjection);
  document.getElementById('stop-auto-faults')?.addEventListener('click', stopAutoFaultInjection);
  
  generateFaultControls();
}

// Initialize Signal Tracing
function initializeSignalTracing() {
  // This will be implemented to show signal flow through the ladder logic
  console.log('Signal tracing initialized');
}

// Update I/O Display
function updateIODisplay() {
  updateDigitalInputs();
  updateDigitalOutputs();
  updateAnalogInputs();
  updateAnalogOutputs();
}

// Update Digital Inputs Display
function updateDigitalInputs() {
  const container = document.getElementById('digital-inputs-grid');
  if (!container) return;
  
  container.innerHTML = Object.entries(plcData.digitalInputs).map(([key, input]) => `
    <div class="digital-input" style="background: #333; padding: 10px; border-radius: 5px; border-left: 4px solid ${input.fault ? '#F44336' : input.state ? '#4CAF50' : '#666'};">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
        <span style="color: #FFFFFF; font-size: 12px; font-weight: bold;">${input.name}</span>
        <div class="led-indicator" style="width: 12px; height: 12px; border-radius: 50%; background: ${input.fault ? '#F44336' : input.state ? '#4CAF50' : '#333'}; border: 1px solid #555;"></div>
      </div>
      <div style="color: #AAA; font-size: 10px;">${input.description}</div>
      <div style="color: #AAA; font-size: 10px;">${key}</div>
    </div>
  `).join('');
}

// Update Digital Outputs Display
function updateDigitalOutputs() {
  const container = document.getElementById('digital-outputs-grid');
  if (!container) return;
  
  container.innerHTML = Object.entries(plcData.digitalOutputs).map(([key, output]) => `
    <div class="digital-output" style="background: #333; padding: 10px; border-radius: 5px; border-left: 4px solid ${output.fault ? '#F44336' : output.state ? '#FF9800' : '#666'};">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
        <span style="color: #FFFFFF; font-size: 12px; font-weight: bold;">${output.name}</span>
        <div class="led-indicator" style="width: 12px; height: 12px; border-radius: 50%; background: ${output.fault ? '#F44336' : output.state ? '#FF9800' : '#333'}; border: 1px solid #555;"></div>
      </div>
      <div style="color: #AAA; font-size: 10px;">${output.description}</div>
      <div style="color: #AAA; font-size: 10px;">${key}</div>
    </div>
  `).join('');
}

// Update Analog Inputs Display
function updateAnalogInputs() {
  const container = document.getElementById('analog-inputs-grid');
  if (!container) return;
  
  container.innerHTML = Object.entries(plcData.analogInputs).map(([key, input]) => `
    <div class="analog-input" style="background: #333; padding: 10px; border-radius: 5px; border-left: 4px solid ${input.fault ? '#F44336' : '#4CAF50'};">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
        <span style="color: #FFFFFF; font-size: 12px; font-weight: bold;">${input.name}</span>
        <span style="color: ${input.fault ? '#F44336' : '#4CAF50'}; font-size: 12px; font-weight: bold;">${input.value} ${input.unit}</span>
      </div>
      <div style="color: #AAA; font-size: 10px;">${input.description}</div>
      <div style="color: #AAA; font-size: 10px;">${key}</div>
    </div>
  `).join('');
}

// Update Analog Outputs Display
function updateAnalogOutputs() {
  const container = document.getElementById('analog-outputs-grid');
  if (!container) return;
  
  container.innerHTML = Object.entries(plcData.analogOutputs).map(([key, output]) => `
    <div class="analog-output" style="background: #333; padding: 10px; border-radius: 5px; border-left: 4px solid ${output.fault ? '#F44336' : '#FF9800'};">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
        <span style="color: #FFFFFF; font-size: 12px; font-weight: bold;">${output.name}</span>
        <span style="color: ${output.fault ? '#F44336' : '#FF9800'}; font-size: 12px; font-weight: bold;">${output.value} ${output.unit}</span>
      </div>
      <div style="color: #AAA; font-size: 10px;">${output.description}</div>
      <div style="color: #AAA; font-size: 10px;">${key}</div>
    </div>
  `).join('');
}

// Generate Manual Input Controls
function generateManualInputControls() {
  const container = document.getElementById('manual-input-controls');
  if (!container) return;
  
  container.innerHTML = Object.entries(plcData.digitalInputs).map(([key, input]) => `
    <button class="manual-input-btn" data-input="${key}" style="background: ${input.state ? '#4CAF50' : '#666'}; color: white; border: none; padding: 5px 8px; border-radius: 3px; font-size: 10px; cursor: pointer; transition: all 0.3s ease;">
      ${input.name}
    </button>
  `).join('');
  
  // Add event listeners
  container.querySelectorAll('.manual-input-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const inputKey = this.dataset.input;
      toggleDigitalInput(inputKey);
    });
  });
}

// Generate Analog Controls
function generateAnalogControls() {
  const container = document.getElementById('analog-controls');
  if (!container) return;
  
  container.innerHTML = Object.entries(plcData.analogInputs).map(([key, input]) => `
    <div class="analog-control" style="display: grid; gap: 5px;">
      <label style="color: #FFFFFF; font-size: 11px;">${input.name}</label>
      <input type="range" min="0" max="100" value="${input.value}" data-input="${key}" style="width: 100%;">
      <span style="color: #AAA; font-size: 10px;">${input.value} ${input.unit}</span>
    </div>
  `).join('');
  
  // Add event listeners
  container.querySelectorAll('input[type="range"]').forEach(slider => {
    slider.addEventListener('input', function() {
      const inputKey = this.dataset.input;
      const value = parseFloat(this.value);
      updateAnalogInput(inputKey, value);
      this.nextElementSibling.textContent = `${value} ${plcData.analogInputs[inputKey].unit}`;
    });
  });
}

// Generate Ladder Rungs
function generateLadderRungs() {
  const container = document.getElementById('ladder-rungs-container');
  if (!container) return;
  
  container.innerHTML = Object.entries(plcData.ladderLogic).map(([key, rung]) => `
    <div class="ladder-rung" style="background: #333; padding: 15px; border-radius: 8px; border-left: 4px solid ${rung.active ? '#4CAF50' : '#666'};">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h6 style="color: #FFFFFF; margin: 0;">${rung.name}</h6>
        <div class="rung-status" style="color: ${rung.active ? '#4CAF50' : '#666'}; font-size: 12px; font-weight: bold;">
          ${rung.active ? 'ACTIVE' : 'INACTIVE'}
        </div>
      </div>
      <div class="rung-logic" style="background: #222; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px; color: #FFFFFF;">
        ${generateRungLogic(rung)}
      </div>
      <div class="rung-output" style="color: #AAA; font-size: 11px; margin-top: 5px;">
        Output: ${rung.output}
      </div>
    </div>
  `).join('');
}

// Generate Rung Logic Display
function generateRungLogic(rung) {
  const conditions = rung.conditions.map(condition => {
    const isInverted = condition.startsWith('!');
    const inputKey = isInverted ? condition.substring(1) : condition;
    const input = plcData.digitalInputs[inputKey] || plcData.analogInputs[inputKey];
    const state = input ? (isInverted ? !input.state : input.state) : false;
    
    return `<span style="color: ${state ? '#4CAF50' : '#666'}; font-weight: bold;">${condition}</span>`;
  }).join(' AND ');
  
  return conditions;
}

// Generate Fault Controls
function generateFaultControls() {
  generateInputFaultControls();
  generateOutputFaultControls();
  generateAnalogFaultControls();
}

// Generate Input Fault Controls
function generateInputFaultControls() {
  const container = document.getElementById('input-fault-controls');
  if (!container) return;
  
  container.innerHTML = Object.entries(plcData.digitalInputs).map(([key, input]) => `
    <button class="fault-btn" data-input="${key}" data-type="digital" style="background: ${input.fault ? '#F44336' : '#666'}; color: white; border: none; padding: 5px 8px; border-radius: 3px; font-size: 10px; cursor: pointer;">
      ${input.name} ${input.fault ? '(FAULT)' : ''}
    </button>
  `).join('');
  
  // Add event listeners
  container.querySelectorAll('.fault-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const inputKey = this.dataset.input;
      const type = this.dataset.type;
      toggleFault(inputKey, type);
    });
  });
}

// Generate Output Fault Controls
function generateOutputFaultControls() {
  const container = document.getElementById('output-fault-controls');
  if (!container) return;
  
  container.innerHTML = Object.entries(plcData.digitalOutputs).map(([key, output]) => `
    <button class="fault-btn" data-output="${key}" data-type="digital" style="background: ${output.fault ? '#F44336' : '#666'}; color: white; border: none; padding: 5px 8px; border-radius: 3px; font-size: 10px; cursor: pointer;">
      ${output.name} ${output.fault ? '(FAULT)' : ''}
    </button>
  `).join('');
  
  // Add event listeners
  container.querySelectorAll('.fault-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const outputKey = this.dataset.output;
      const type = this.dataset.type;
      toggleFault(outputKey, type);
    });
  });
}

// Generate Analog Fault Controls
function generateAnalogFaultControls() {
  const container = document.getElementById('analog-fault-controls');
  if (!container) return;
  
  container.innerHTML = Object.entries(plcData.analogInputs).map(([key, input]) => `
    <button class="fault-btn" data-input="${key}" data-type="analog" style="background: ${input.fault ? '#F44336' : '#666'}; color: white; border: none; padding: 5px 8px; border-radius: 3px; font-size: 10px; cursor: pointer;">
      ${input.name} ${input.fault ? '(FAULT)' : ''}
    </button>
  `).join('');
  
  // Add event listeners
  container.querySelectorAll('.fault-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const inputKey = this.dataset.input;
      const type = this.dataset.type;
      toggleFault(inputKey, type);
    });
  });
}

// Toggle Digital Input
function toggleDigitalInput(inputKey) {
  if (plcData.digitalInputs[inputKey]) {
    plcData.digitalInputs[inputKey].state = !plcData.digitalInputs[inputKey].state;
    updateIODisplay();
    updateLadderLogic();
    generateManualInputControls();
  }
}

// Update Analog Input
function updateAnalogInput(inputKey, value) {
  if (plcData.analogInputs[inputKey]) {
    plcData.analogInputs[inputKey].value = value;
    updateIODisplay();
    updateLadderLogic();
  }
}

// Toggle Fault
function toggleFault(key, type) {
  if (type === 'digital') {
    if (plcData.digitalInputs[key]) {
      plcData.digitalInputs[key].fault = !plcData.digitalInputs[key].fault;
    } else if (plcData.digitalOutputs[key]) {
      plcData.digitalOutputs[key].fault = !plcData.digitalOutputs[key].fault;
    }
  } else if (type === 'analog') {
    if (plcData.analogInputs[key]) {
      plcData.analogInputs[key].fault = !plcData.analogInputs[key].fault;
    } else if (plcData.analogOutputs[key]) {
      plcData.analogOutputs[key].fault = !plcData.analogOutputs[key].fault;
    }
  }
  
  updateIODisplay();
  generateFaultControls();
  updateSystemInfo();
}

// Update Ladder Logic
function updateLadderLogic() {
  // Evaluate each rung
  Object.entries(plcData.ladderLogic).forEach(([key, rung]) => {
    rung.active = evaluateRung(rung);
    if (rung.active && rung.output) {
      // Activate the output
      if (plcData.digitalOutputs[rung.output]) {
        plcData.digitalOutputs[rung.output].state = true;
      }
    }
  });
  
  generateLadderRungs();
  updateIODisplay();
  updateSystemInfo();
}

// Evaluate Rung Logic
function evaluateRung(rung) {
  return rung.conditions.every(condition => {
    const isInverted = condition.startsWith('!');
    const inputKey = isInverted ? condition.substring(1) : condition;
    const input = plcData.digitalInputs[inputKey] || plcData.analogInputs[inputKey];
    
    if (!input) return false;
    
    if (inputKey.startsWith('AI_')) {
      // Analog input logic (simplified)
      return isInverted ? input.value < 50 : input.value >= 50;
    } else {
      // Digital input logic
      return isInverted ? !input.state : input.state;
    }
  });
}

// Start PLC System
function startPLCSystem() {
  plcData.systemStatus = 'running';
  updateSystemInfo();
  startPLCMonitoring();
}

// Stop PLC System
function stopPLCSystem() {
  plcData.systemStatus = 'stopped';
  updateSystemInfo();
  stopPLCMonitoring();
}

// Update System Info
function updateSystemInfo() {
  const statusElement = document.getElementById('plc-system-status');
  const activeRungsElement = document.getElementById('plc-active-rungs');
  const faultCountElement = document.getElementById('plc-fault-count');
  
  if (statusElement) {
    statusElement.textContent = plcData.systemStatus.toUpperCase();
    statusElement.style.color = plcData.systemStatus === 'running' ? '#4CAF50' : '#FF9800';
  }
  
  if (activeRungsElement) {
    const activeRungs = Object.values(plcData.ladderLogic).filter(rung => rung.active).length;
    activeRungsElement.textContent = activeRungs;
  }
  
  if (faultCountElement) {
    const faultCount = [
      ...Object.values(plcData.digitalInputs),
      ...Object.values(plcData.digitalOutputs),
      ...Object.values(plcData.analogInputs),
      ...Object.values(plcData.analogOutputs)
    ].filter(item => item.fault).length;
    faultCountElement.textContent = faultCount;
  }
}

// Start PLC Monitoring
function startPLCMonitoring() {
  if (plcData.simulationInterval) {
    clearInterval(plcData.simulationInterval);
  }
  
  plcData.simulationInterval = setInterval(() => {
    if (plcData.systemStatus === 'running') {
      updateLadderLogic();
    }
  }, plcData.scanTime);
}

// Stop PLC Monitoring
function stopPLCMonitoring() {
  if (plcData.simulationInterval) {
    clearInterval(plcData.simulationInterval);
    plcData.simulationInterval = null;
  }
}

// Start Auto Fault Injection
function startAutoFaultInjection() {
  if (plcData.faultInjectionInterval) {
    clearInterval(plcData.faultInjectionInterval);
  }
  
  plcData.faultInjectionInterval = setInterval(() => {
    injectRandomFault();
  }, 30000); // 30 seconds
  
  updateFaultTimer();
}

// Stop Auto Fault Injection
function stopAutoFaultInjection() {
  if (plcData.faultInjectionInterval) {
    clearInterval(plcData.faultInjectionInterval);
    plcData.faultInjectionInterval = null;
  }
  
  const timerElement = document.getElementById('next-fault-timer');
  if (timerElement) {
    timerElement.textContent = '--';
  }
}

// Inject Random Fault
function injectRandomFault() {
  const allInputs = Object.keys(plcData.digitalInputs);
  const allOutputs = Object.keys(plcData.digitalOutputs);
  const allAnalogInputs = Object.keys(plcData.analogInputs);
  
  const allComponents = [...allInputs, ...allOutputs, ...allAnalogInputs];
  const randomComponent = allComponents[Math.floor(Math.random() * allComponents.length)];
  
  if (randomComponent) {
    const type = allInputs.includes(randomComponent) ? 'digital' : 
                 allOutputs.includes(randomComponent) ? 'digital' : 'analog';
    toggleFault(randomComponent, type);
    
    // Add to fault history
    const fault = {
      timestamp: new Date().toLocaleTimeString(),
      component: randomComponent,
      type: 'auto-injected'
    };
    plcData.faultHistory.push(fault);
  }
  
  updateFaultTimer();
}

// Update Fault Timer
function updateFaultTimer() {
  const timerElement = document.getElementById('next-fault-timer');
  if (timerElement && plcData.faultInjectionInterval) {
    // Simple countdown (in real implementation, you'd track actual time)
    timerElement.textContent = '30s';
  }
}

// Export functions for global access
window.initializePLCSimulation = initializePLCSimulation;
window.plcData = plcData; 