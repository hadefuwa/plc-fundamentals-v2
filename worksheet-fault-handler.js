// Fault Scenario Worksheet Handler
// This file contains specific logic for handling fault/troubleshooting worksheets

// Enhanced content templates for fault scenarios
const faultScenarioTemplates = {
  1: {
    title: "Sterilizer Malfunction",
    type: "interactive",
    hasSimulation: true,
    simulationType: 'sterilizer-fault',
    investigationTools: [
      {
        id: 'temperature-check',
        name: 'Temperature Monitoring',
        description: 'Check current temperature readings and trends',
        icon: 'fas fa-thermometer-half'
      },
      {
        id: 'pressure-analysis',
        name: 'Pressure Analysis', 
        description: 'Analyze pressure levels and valve positions',
        icon: 'fas fa-tachometer-alt'
      },
      {
        id: 'alarm-history',
        name: 'Alarm History',
        description: 'Review recent system alarms and events',
        icon: 'fas fa-exclamation-triangle'
      },
      {
        id: 'sensor-diagnostics',
        name: 'Sensor Diagnostics',
        description: 'Test sensor functionality and calibration',
        icon: 'fas fa-search'
      }
    ],
    learningObjectives: [
      "Understand systematic fault diagnosis procedures",
      "Learn to use diagnostic tools effectively", 
      "Practice root cause analysis techniques",
      "Develop troubleshooting decision-making skills"
    ]
  },
  2: {
    title: "Cooling System Failure",
    type: "guided",
    hasSimulation: false,
    investigationSteps: [
      "Check coolant levels and flow rates",
      "Inspect pump operation and pressure",
      "Verify temperature sensor readings",
      "Examine valve positions and control signals"
    ],
    commonCauses: [
      "Coolant leak or low levels",
      "Pump failure or cavitation",
      "Blocked filters or heat exchangers",
      "Faulty temperature sensors",
      "Control valve malfunction"
    ]
  },
  3: {
    title: "Production Line Stoppage", 
    type: "scenario-based",
    hasSimulation: false,
    faultCategories: [
      { name: "Mechanical", probability: 35, examples: ["Belt breakage", "Bearing failure", "Misalignment"] },
      { name: "Electrical", probability: 25, examples: ["Motor failure", "Wiring issues", "Control faults"] },
      { name: "Pneumatic", probability: 20, examples: ["Air leaks", "Valve failures", "Pressure drops"] },
      { name: "Process", probability: 20, examples: ["Material issues", "Settings drift", "Contamination"] }
    ]
  }
};

// Get fault scenario content
function getFaultScenarioContent(scenarioId) {
  return faultScenarioTemplates[scenarioId] || getDefaultFaultContent();
}

// Default fault content template
function getDefaultFaultContent() {
  return {
    title: "General Fault Investigation",
    type: "basic",
    hasSimulation: false,
    investigationSteps: [
      "Gather initial information about the fault",
      "Observe system behavior and symptoms", 
      "Test potential causes systematically",
      "Implement corrective actions and verify"
    ],
    learningObjectives: [
      "Apply systematic troubleshooting methods",
      "Document findings and actions taken",
      "Verify system operation after repairs"
    ]
  };
}

// Render interactive fault scenario (for special scenarios like scenario 1)
function renderInteractiveFaultScenario(scenario) {
  const container = document.getElementById('worksheet-content');
  const scenarioContent = getFaultScenarioContent(scenario.id);
  
  container.innerHTML = `
    <h1 class="page-title">Scenario ${scenario.id}: ${scenario.title}</h1>
    ${scenario.subtitle ? `<h2 class="page-subtitle" style="color: #AAA; margin-bottom: 30px; font-size: 18px; text-align: center;">${scenario.subtitle}</h2>` : ''}

    <!-- Learning Objectives -->
    <div class="learning-objectives-section" style="background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-radius: 12px; padding: 30px; margin-bottom: 40px; border: 2px solid #2196F3; box-shadow: 0 8px 20px rgba(33, 150, 243, 0.2);">
      <h2 class="section-header" style="color: #2196F3; margin-bottom: 25px; font-size: 24px; display: flex; align-items: center; gap: 10px;"><i class="fas fa-graduation-cap"></i> Learning Objectives</h2>
      <div class="objectives-list">
        ${scenarioContent.learningObjectives ? scenarioContent.learningObjectives.map(objective => `
          <div class="objective-item" style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 15px; padding: 15px; background: #333; border-radius: 8px;">
            <i class="fas fa-check-circle" style="color: #4CAF50; font-size: 18px; margin-top: 2px;"></i>
            <span style="color: #FFFFFF;">${objective}</span>
          </div>
        `).join('') : '<p style="color: #FFFFFF;">Complete this scenario to develop troubleshooting skills.</p>'}
      </div>
    </div>

    <!-- Scenario Description -->
    <div class="worksheet-section introduction-section" style="background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-radius: 12px; padding: 30px; margin-bottom: 40px; border: 2px solid #f44336; box-shadow: 0 8px 20px rgba(244, 67, 54, 0.2);">
      <h2 class="section-header" style="color: #f44336; margin-bottom: 25px; font-size: 24px; display: flex; align-items: center; gap: 10px;"><i class="fas fa-exclamation-triangle"></i> Fault Scenario</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <div class="worksheet-content">
          ${(scenario.introduction?.paragraphs || scenario.paragraphs || []).map(p => `<p style="color: #FFFFFF; margin-bottom: 15px;">${p}</p>`).join('')}
        </div>
        ${scenario.image ? `
        <div style="text-align: center;">
          <img src="assets/scenarios/${scenario.image}" alt="${scenario.title}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
        </div>
        ` : ''}
      </div>
    </div>

    <!-- System Overview (if available) -->
    ${scenario.system_overview ? renderSystemOverview(scenario.system_overview) : ''}

    <!-- Investigation Tools Section -->
    ${scenarioContent.investigationTools ? renderInvestigationTools(scenarioContent.investigationTools) : ''}

    <!-- Interactive Simulation Section -->
    ${scenarioContent.hasSimulation ? renderFaultSimulation(scenarioContent.simulationType) : ''}

    <!-- Questions Section -->
    ${scenario.questions ? renderFaultQuestions(scenario.questions) : ''}
  `;

  // Initialize interactive features
  setTimeout(() => {
    initializeFaultScenarioFeatures();
    loadSavedAnswers();
  }, 100);
}

// Render system overview section
function renderSystemOverview(systemOverview) {
  return `
    <div class="system-overview-section" style="background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-radius: 12px; padding: 30px; margin-bottom: 40px; border: 2px solid #2196F3; box-shadow: 0 8px 20px rgba(33, 150, 243, 0.2);">
      <h2 class="section-header" style="color: #2196F3; margin-bottom: 25px; font-size: 24px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-tachometer-alt"></i> Current System Status
      </h2>
      <div class="status-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
        ${systemOverview.components ? systemOverview.components.map(component => `
        <div class="component-status" style="background: #333; padding: 20px; border-radius: 8px; border-left: 4px solid ${getStatusColor(component.status)};">
          <h4 style="color: #FFFFFF; margin-bottom: 10px;">${component.name}</h4>
          <p style="color: #AAA; margin-bottom: 8px;">Location: ${component.location}</p>
          <p style="color: #AAA; margin-bottom: 8px;">Status: <span style="color: ${getStatusColor(component.status)};">${component.status}</span></p>
          ${component.reading ? `<p style="color: #AAA;">Reading: ${component.reading}</p>` : ''}
        </div>
        `).join('') : ''}
      </div>
    </div>
  `;
}

// Render investigation tools section
function renderInvestigationTools(tools) {
  return `
    <div class="investigation-tools-section" style="background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-radius: 12px; padding: 30px; margin-bottom: 40px; border: 2px solid #FF9800; box-shadow: 0 8px 20px rgba(255, 152, 0, 0.2);">
      <h2 class="section-header" style="color: #FF9800; margin-bottom: 25px; font-size: 24px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-tools"></i> Investigation Tools
      </h2>
      <p style="color: #FFFFFF; margin-bottom: 20px;">Use these diagnostic tools to investigate the problem and gather information:</p>
      <div class="tools-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
        ${tools.map(tool => `
        <button class="investigation-tool" onclick="useTool('${tool.id}')" style="background: #333; color: white; border: 2px solid #FF9800; padding: 20px; border-radius: 8px; cursor: pointer; text-align: left; transition: all 0.3s ease;">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
            <i class="${tool.icon}" style="color: #FF9800; font-size: 24px;"></i>
            <h4 style="color: #FF9800; margin: 0;">${tool.name}</h4>
          </div>
          <p style="color: #FFFFFF; margin: 0; font-size: 14px;">${tool.description}</p>
        </button>
        `).join('')}
      </div>
      
      <div id="tool-results" style="margin-top: 30px; padding: 20px; background: #333; border-radius: 8px; display: none;">
        <h3 style="color: #FFFFFF; margin-bottom: 15px;">Investigation Results</h3>
        <div id="tool-results-content" style="color: #FFFFFF;"></div>
      </div>
    </div>
  `;
}

// Render fault simulation section
function renderFaultSimulation(simulationType) {
  return `
    <div class="simulation-section" style="background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-radius: 12px; padding: 30px; margin-top: 40px; border: 2px solid #E91E63; box-shadow: 0 8px 20px rgba(233, 30, 99, 0.3);">
      <h2 class="section-header" style="color: #E91E63; margin-bottom: 25px; font-size: 24px; display: flex; align-items: center; gap: 10px;"><i class="fas fa-desktop"></i> Interactive System Simulation</h2>
      
      <div id="fault-simulation-container" style="background: #333; padding: 20px; border-radius: 8px; min-height: 400px;">
        <div class="simulation-loading" style="text-align: center; color: #FFFFFF; padding: 50px;">
          <i class="fas fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 15px;"></i>
          <p>Loading ${simulationType} simulation...</p>
          <p style="color: #AAA; font-size: 14px;">Interact with the system to diagnose the fault</p>
        </div>
      </div>
      
      <div class="simulation-instructions" style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <h4 style="color: #E91E63; margin-bottom: 15px;"><i class="fas fa-info-circle"></i> Simulation Instructions</h4>
        <ul style="color: #FFFFFF; margin: 0; padding-left: 20px;">
          <li>Use the investigation tools to gather data about the system</li>
          <li>Observe system behavior and identify abnormal readings</li>
          <li>Form hypotheses about potential causes</li>
          <li>Test your theories using the available diagnostic tools</li>
          <li>Document your findings and recommended actions</li>
        </ul>
      </div>
    </div>
  `;
}

// Render fault questions section
function renderFaultQuestions(questions) {
  return `
    <div class="questions-section" style="background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-radius: 12px; padding: 30px; margin-bottom: 40px; border: 2px solid #4CAF50; box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);">
      <h2 class="section-header" style="color: #4CAF50; margin-bottom: 25px; font-size: 24px; display: flex; align-items: center; gap: 10px;"><i class="fas fa-question-circle"></i> Investigation Questions</h2>
      <div class="questions-content">
        <div class="instructions" style="background: #333; padding: 15px; border-radius: 8px; margin-bottom: 20px; color: #FFFFFF;">
          <strong>Instructions:</strong> Answer each question based on your investigation and analysis of the fault scenario.
        </div>
        
        ${questions.map((q, index) => `
          <div class="question-item" data-question="${index + 1}" style="background: #333; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
            <h4 style="color: #FFFFFF; margin-bottom: 10px;">Question ${index + 1}: ${q.text}</h4>
            ${q.type === 'multiple_choice' ? renderMultipleChoiceQuestion(q, index) : renderTextQuestion(q, index)}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Render multiple choice question
function renderMultipleChoiceQuestion(question, index) {
  return `
    <div class="multiple-choice-options" style="margin-bottom: 15px;">
      ${question.options.map((option, optionIndex) => `
        <label class="option-label" style="display: block; margin-bottom: 10px; cursor: pointer; padding: 10px; border: 2px solid #555; border-radius: 6px; background: #222; transition: all 0.3s ease;">
          <input type="radio" name="question-${question.id || index}" value="${optionIndex}" class="option-radio" style="margin-right: 10px;">
          <span style="color: #FFFFFF;">${option}</span>
        </label>
      `).join('')}
    </div>
    <div class="question-actions" style="margin-top: 15px;">
      <button class="submit-question-btn" onclick="submitMultipleChoiceQuestion('${question.id || index}')" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Submit Answer</button>
      <span class="submit-note" style="color: #AAA; margin-left: 10px;">Select an option and click submit to see feedback.</span>
    </div>
    <div class="answer-feedback hidden" style="margin-top: 15px; padding: 15px; border-radius: 4px; display: none;">
      <div class="feedback-content"></div>
    </div>
  `;
}

// Render text question  
function renderTextQuestion(question, index) {
  return `
    <textarea class="answer-input" data-question="${index + 1}" placeholder="${question.placeholder || 'Enter your answer here...'}" style="width: 100%; height: 100px; padding: 10px; border: 1px solid #555; border-radius: 4px; background: #222; color: #FFFFFF; resize: vertical;"></textarea>
    <div class="question-actions" style="margin-top: 15px;">
      <button class="submit-question-btn" onclick="submitAnswer(${index + 1})" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Submit Answer</button>
      <span class="submit-note" style="color: #AAA; margin-left: 10px;">Your answer will be saved automatically.</span>
    </div>
  `;
}

// Get status color based on status text
function getStatusColor(status) {
  if (status.includes('normal') || status.includes('ok')) return '#4CAF50';
  if (status.includes('critical') || status.includes('alarm') || status.includes('fault')) return '#f44336';
  if (status.includes('warning') || status.includes('caution')) return '#FF9800';
  return '#2196F3';
}

// Initialize fault scenario interactive features
function initializeFaultScenarioFeatures() {
  // Initialize tool result handlers
  initializeToolHandlers();
  
  // Initialize any simulation features
  initializeSimulationFeatures();
}

// Initialize investigation tool handlers
function initializeToolHandlers() {
  // Tool usage will be handled by individual simulation scripts
  console.log('Fault scenario tool handlers initialized');
}

// Initialize simulation features
function initializeSimulationFeatures() {
  // Simulation features will be handled by individual simulation scripts
  console.log('Fault simulation features initialized');
}

// Tool usage function (to be called by investigation tools)
function useTool(toolId) {
  const toolResultsDiv = document.getElementById('tool-results');
  const toolResultsContent = document.getElementById('tool-results-content');
  
  if (!toolResultsDiv || !toolResultsContent) return;
  
  // Show results container
  toolResultsDiv.style.display = 'block';
  
  // Simulate tool usage (this would be enhanced with actual tool logic)
  const toolResults = {
    'temperature-check': {
      title: 'Temperature Analysis Results',
      data: 'Current temperature: 127°C (Normal: 121°C ±2°C)<br/>Temperature trend: Gradually increasing over last 30 minutes<br/>Status: <span style="color: #FF9800;">Above normal range</span>'
    },
    'pressure-analysis': {
      title: 'Pressure System Analysis',
      data: 'Chamber pressure: 15.2 psi (Normal: 15.0 psi ±0.5 psi)<br/>Steam supply pressure: 18.1 psi (Normal: 18.0 psi ±1.0 psi)<br/>Status: <span style="color: #4CAF50;">Within normal parameters</span>'
    },
    'alarm-history': {
      title: 'Recent System Alarms',
      data: '14:23 - High Temperature Warning<br/>14:15 - Temperature Sensor Calibration Due<br/>13:45 - Cycle Complete<br/>Status: <span style="color: #FF9800;">Active temperature warning</span>'
    },
    'sensor-diagnostics': {
      title: 'Sensor Diagnostic Results',
      data: 'Temperature sensor: Response time 2.1s (Normal: <2.0s)<br/>Pressure sensor: Calibration offset +0.1 psi<br/>Status: <span style="color: #FF9800;">Temperature sensor response degraded</span>'
    }
  };
  
  const result = toolResults[toolId] || {
    title: 'Tool Results',
    data: 'Tool data not available for this simulation.'
  };
  
  toolResultsContent.innerHTML = `
    <h4 style="color: #FF9800; margin-bottom: 15px;">${result.title}</h4>
    <div style="background: #222; padding: 15px; border-radius: 6px; border-left: 3px solid #FF9800;">
      ${result.data}
    </div>
  `;
  
  // Scroll to results
  toolResultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Check if this file should handle the current worksheet
function shouldUseFaultHandler() {
  return getUrlParameter('type') === 'fault';
}

// Enhanced fault scenario rendering (main entry point)
function renderFaultScenario(scenario) {
  const scenarioContent = getFaultScenarioContent(scenario.id);
  
  if (scenarioContent.type === 'interactive') {
    renderInteractiveFaultScenario(scenario);
  } else {
    renderBasicFaultScenario(scenario);
  }
}

// Render basic fault scenario (for simpler scenarios)
function renderBasicFaultScenario(scenario) {
  const container = document.getElementById('worksheet-content');
  
  container.innerHTML = `
    <h1 class="page-title">Scenario ${scenario.id}: ${scenario.title}</h1>
    ${scenario.subtitle ? `<h2 class="page-subtitle" style="color: #AAA; margin-bottom: 30px; font-size: 18px; text-align: center;">${scenario.subtitle}</h2>` : ''}

    <div class="worksheet-section introduction-section" style="background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-radius: 12px; padding: 30px; margin-bottom: 40px; border: 2px solid #f44336; box-shadow: 0 8px 20px rgba(244, 67, 54, 0.2);">
      <h2 class="section-header" style="color: #f44336; margin-bottom: 25px; font-size: 24px; display: flex; align-items: center; gap: 10px;"><i class="fas fa-exclamation-triangle"></i> Scenario Description</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <div class="worksheet-content">
          ${(scenario.introduction?.paragraphs || scenario.paragraphs || []).map(p => `<p style="color: #FFFFFF; margin-bottom: 15px;">${p}</p>`).join('')}
        </div>
        ${scenario.image ? `
        <div style="text-align: center;">
          <img src="assets/scenarios/${scenario.image}" alt="${scenario.title}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);">
        </div>
        ` : ''}
      </div>
    </div>

    ${scenario.questions ? renderFaultQuestions(scenario.questions) : ''}
  `;

  setTimeout(() => {
    loadSavedAnswers();
  }, 100);
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getFaultScenarioContent,
    renderInteractiveFaultScenario,
    renderFaultScenario,
    shouldUseFaultHandler,
    useTool
  };
} 