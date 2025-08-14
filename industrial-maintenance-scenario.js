// Industrial Maintenance Scenario System
// Comprehensive maintenance training with real-world scenarios

// Scenario System State
let scenarioData = {
  // Current Scenario
  currentScenario: null,
  scenarioStep: 0,
  scenarioProgress: 0,
  
  // Available Scenarios
  scenarios: {
    emergencyShutdown: {
      id: 'emergency_shutdown',
      title: 'Emergency System Shutdown',
      description: 'Respond to an emergency shutdown and restore system operation safely',
      difficulty: 'high',
      estimatedTime: 30, // minutes
      steps: [
        {
          id: 1,
          title: 'Emergency Stop Activation',
          description: 'System has experienced an emergency stop. Identify the cause and ensure safety.',
          tasks: [
            'Check emergency stop button status',
            'Verify all safety systems are engaged',
            'Identify the trigger for emergency stop',
            'Document the incident'
          ],
          safetyChecks: [
            'Ensure equipment is completely stopped',
            'Verify lockout/tagout procedures',
            'Check for any immediate hazards',
            'Confirm emergency response team notification'
          ],
          simulations: ['emergency-stop', 'plc', 'hmi']
        },
        {
          id: 2,
          title: 'System Investigation',
          description: 'Investigate the root cause of the emergency stop activation.',
          tasks: [
            'Review HMI alarm history',
            'Check PLC fault logs',
            'Inspect emergency stop circuits',
            'Test safety system functionality'
          ],
          safetyChecks: [
            'Maintain lockout/tagout',
            'Use proper PPE',
            'Follow confined space procedures if needed',
            'Document all findings'
          ],
          simulations: ['plc', 'hmi', 'status-led']
        },
        {
          id: 3,
          title: 'System Restoration',
          description: 'Safely restore system operation after resolving the issue.',
          tasks: [
            'Remove lockout/tagout devices',
            'Reset emergency stop system',
            'Verify all safety systems',
            'Start system in manual mode',
            'Test automatic operation'
          ],
          safetyChecks: [
            'Complete safety checklist',
            'Verify all personnel are clear',
            'Test emergency stop functionality',
            'Confirm system readiness'
          ],
          simulations: ['emergency-stop', 'plc', 'hmi', 'pump', 'valve']
        }
      ]
    },
    
    pumpMaintenance: {
      id: 'pump_maintenance',
      title: 'Pump Preventive Maintenance',
      description: 'Perform scheduled preventive maintenance on the main pump system',
      difficulty: 'medium',
      estimatedTime: 45,
      steps: [
        {
          id: 1,
          title: 'Pre-Maintenance Safety',
          description: 'Prepare for pump maintenance with proper safety procedures.',
          tasks: [
            'Review maintenance procedures',
            'Complete safety checklist',
            'Set up work area',
            'Gather required tools and parts'
          ],
          safetyChecks: [
            'Lockout/tagout pump system',
            'Verify isolation from power',
            'Check for residual pressure',
            'Ensure proper ventilation'
          ],
          simulations: ['pump', 'plc', 'hmi']
        },
        {
          id: 2,
          title: 'Pump Inspection',
          description: 'Inspect pump components for wear and damage.',
          tasks: [
            'Check pump bearings',
            'Inspect impeller condition',
            'Verify seal integrity',
            'Test motor operation',
            'Check alignment'
          ],
          safetyChecks: [
            'Maintain lockout/tagout',
            'Use proper PPE',
            'Follow confined space procedures',
            'Document inspection results'
          ],
          simulations: ['pump', 'float-switch']
        },
        {
          id: 3,
          title: 'Component Replacement',
          description: 'Replace worn components and perform adjustments.',
          tasks: [
            'Replace worn bearings',
            'Install new seals',
            'Adjust pump alignment',
            'Lubricate components',
            'Test pump operation'
          ],
          safetyChecks: [
            'Follow manufacturer procedures',
            'Use proper tools and equipment',
            'Verify component specifications',
            'Test after installation'
          ],
          simulations: ['pump', 'valve', 'flow-sensor']
        }
      ]
    },
    
    valveCalibration: {
      id: 'valve_calibration',
      title: 'Valve Calibration and Testing',
      description: 'Calibrate control valves and verify proper operation',
      difficulty: 'medium',
      estimatedTime: 60,
      steps: [
        {
          id: 1,
          title: 'Calibration Preparation',
          description: 'Prepare for valve calibration procedures.',
          tasks: [
            'Review valve specifications',
            'Set up calibration equipment',
            'Verify test conditions',
            'Check calibration standards'
          ],
          safetyChecks: [
            'Isolate valve from process',
            'Verify pressure relief',
            'Check for hazardous materials',
            'Ensure proper ventilation'
          ],
          simulations: ['valve', 'plc', 'hmi']
        },
        {
          id: 2,
          title: 'Calibration Procedure',
          description: 'Perform valve calibration and testing.',
          tasks: [
            'Zero calibration',
            'Span calibration',
            'Linearity testing',
            'Hysteresis testing',
            'Response time measurement'
          ],
          safetyChecks: [
            'Follow calibration procedures',
            'Document all measurements',
            'Verify calibration accuracy',
            'Test safety functions'
          ],
          simulations: ['valve', 'temperature-sensor']
        },
        {
          id: 3,
          title: 'System Integration',
          description: 'Integrate calibrated valve back into system.',
          tasks: [
            'Update control parameters',
            'Test automatic operation',
            'Verify system response',
            'Document calibration results'
          ],
          safetyChecks: [
            'Test emergency functions',
            'Verify fail-safe operation',
            'Check system integration',
            'Update maintenance records'
          ],
          simulations: ['valve', 'plc', 'hmi', 'pump']
        }
      ]
    },
    
    sensorTroubleshooting: {
      id: 'sensor_troubleshooting',
      title: 'Sensor System Troubleshooting',
      description: 'Diagnose and resolve sensor-related issues',
      difficulty: 'high',
      estimatedTime: 90,
      steps: [
        {
          id: 1,
          title: 'Problem Identification',
          description: 'Identify and document sensor problems.',
          tasks: [
            'Review sensor readings',
            'Check for abnormal behavior',
            'Identify affected systems',
            'Document symptoms'
          ],
          safetyChecks: [
            'Verify system safety',
            'Check for electrical hazards',
            'Ensure proper isolation',
            'Follow troubleshooting procedures'
          ],
          simulations: ['plc', 'hmi', 'status-led']
        },
        {
          id: 2,
          title: 'Diagnostic Testing',
          description: 'Perform diagnostic tests on sensor systems.',
          tasks: [
            'Test sensor output',
            'Check wiring continuity',
            'Verify power supply',
            'Test signal conditioning',
            'Check for interference'
          ],
          safetyChecks: [
            'Use proper test equipment',
            'Follow electrical safety',
            'Document test results',
            'Maintain system safety'
          ],
          simulations: ['float-switch', 'proximity-switch', 'flow-sensor']
        },
        {
          id: 3,
          title: 'Repair and Verification',
          description: 'Repair sensor issues and verify operation.',
          tasks: [
            'Replace faulty components',
            'Calibrate sensors',
            'Test system operation',
            'Verify accuracy',
            'Update documentation'
          ],
          safetyChecks: [
            'Test all safety functions',
            'Verify system integration',
            'Check for proper operation',
            'Update maintenance records'
          ],
          simulations: ['temperature-sensor', 'analog-sensors', 'digital-sensors']
        }
      ]
    }
  },
  
  // Scenario Progress
  progress: {
    completedSteps: [],
    currentStep: null,
    startTime: null,
    elapsedTime: 0,
    safetyViolations: 0,
    performanceScore: 0
  },
  
  // Assessment Criteria
  assessment: {
    safetyCompliance: 0,
    technicalAccuracy: 0,
    timeEfficiency: 0,
    documentation: 0,
    overallScore: 0
  }
};

// Initialize Industrial Maintenance Scenario
function initializeIndustrialMaintenanceScenario() {
  console.log('Initializing Industrial Maintenance Scenario...');
  
  initializeScenarioSelector();
  initializeScenarioInterface();
  initializeAssessmentPanel();
  
  console.log('Industrial Maintenance Scenario initialized');
}

// Initialize Scenario Selector
function initializeScenarioSelector() {
  const container = document.getElementById('scenario-selector-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="scenario-selector" style="background: #1a1a1a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #2196F3; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-industry"></i> Industrial Maintenance Scenarios
      </h4>
      
      <div class="scenario-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
        ${Object.values(scenarioData.scenarios).map(scenario => `
          <div class="scenario-card" style="background: #333; padding: 20px; border-radius: 8px; border-left: 4px solid ${getDifficultyColor(scenario.difficulty)}; cursor: pointer;" data-scenario="${scenario.id}">
            <h5 style="color: #FFFFFF; margin-bottom: 10px;">${scenario.title}</h5>
            <p style="color: #AAA; font-size: 12px; margin-bottom: 15px;">${scenario.description}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="color: #AAA; font-size: 11px;">Difficulty: <span style="color: ${getDifficultyColor(scenario.difficulty)}; font-weight: bold;">${scenario.difficulty.toUpperCase()}</span></span>
              <span style="color: #AAA; font-size: 11px;">Time: ${scenario.estimatedTime} min</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #AAA; font-size: 11px;">Steps: ${scenario.steps.length}</span>
              <button class="start-scenario-btn" data-scenario="${scenario.id}" style="background: #4CAF50; color: white; border: none; padding: 8px 15px; border-radius: 3px; cursor: pointer; font-size: 12px;">
                Start Scenario
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Add event listeners
  addScenarioSelectorEventListeners();
}

// Initialize Scenario Interface
function initializeScenarioInterface() {
  const container = document.getElementById('scenario-interface-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="scenario-interface" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px; display: none;">
      <h4 style="color: #2196F3; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-play-circle"></i> Active Scenario: <span id="active-scenario-title">None</span>
      </h4>
      
      <!-- Progress Bar -->
      <div class="progress-section" style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="color: #FFFFFF; font-size: 14px;">Progress</span>
          <span id="progress-percentage" style="color: #4CAF50; font-weight: bold;">0%</span>
        </div>
        <div style="background: #333; height: 10px; border-radius: 5px; overflow: hidden;">
          <div id="progress-bar" style="background: #4CAF50; height: 100%; width: 0%; transition: width 0.3s ease;"></div>
        </div>
      </div>
      
      <!-- Current Step -->
      <div class="current-step" style="background: #333; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Current Step: <span id="current-step-title">None</span></h5>
        <p id="current-step-description" style="color: #AAA; font-size: 14px; margin-bottom: 15px;">No active step</p>
        
        <!-- Tasks -->
        <div class="tasks-section" style="margin-bottom: 15px;">
          <h6 style="color: #FF9800; margin-bottom: 10px;">Required Tasks:</h6>
          <div id="current-tasks-list" style="display: grid; gap: 8px;">
            <!-- Tasks will be populated here -->
          </div>
        </div>
        
        <!-- Safety Checks -->
        <div class="safety-section">
          <h6 style="color: #F44336; margin-bottom: 10px;">Safety Checks:</h6>
          <div id="current-safety-list" style="display: grid; gap: 8px;">
            <!-- Safety checks will be populated here -->
          </div>
        </div>
      </div>
      
      <!-- Navigation -->
      <div class="scenario-navigation" style="display: flex; gap: 10px; justify-content: center;">
        <button id="prev-step-btn" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
          <i class="fas fa-chevron-left"></i> Previous
        </button>
        <button id="complete-step-btn" style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
          Complete Step
        </button>
        <button id="next-step-btn" style="background: #2196F3; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
          Next <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <!-- Scenario Controls -->
      <div class="scenario-controls" style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
        <button id="pause-scenario-btn" style="background: #FF9800; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
          <i class="fas fa-pause"></i> Pause
        </button>
        <button id="reset-scenario-btn" style="background: #F44336; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
          <i class="fas fa-redo"></i> Reset
        </button>
        <button id="end-scenario-btn" style="background: #9C27B0; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
          <i class="fas fa-stop"></i> End Scenario
        </button>
      </div>
    </div>
  `;
  
  // Add event listeners
  addScenarioInterfaceEventListeners();
}

// Initialize Assessment Panel
function initializeAssessmentPanel() {
  const container = document.getElementById('assessment-panel');
  if (!container) return;
  
  container.innerHTML = `
    <div class="assessment-panel" style="background: #2a2a2a; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
      <h4 style="color: #9C27B0; margin-bottom: 20px; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-chart-bar"></i> Performance Assessment
      </h4>
      
      <!-- Assessment Criteria -->
      <div class="assessment-criteria" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
        <div class="criteria-card" style="background: #333; padding: 15px; border-radius: 8px; text-align: center;">
          <div id="safety-score" style="color: #F44336; font-size: 24px; font-weight: bold;">0%</div>
          <div style="color: #AAA; font-size: 12px;">Safety Compliance</div>
        </div>
        <div class="criteria-card" style="background: #333; padding: 15px; border-radius: 8px; text-align: center;">
          <div id="technical-score" style="color: #2196F3; font-size: 24px; font-weight: bold;">0%</div>
          <div style="color: #AAA; font-size: 12px;">Technical Accuracy</div>
        </div>
        <div class="criteria-card" style="background: #333; padding: 15px; border-radius: 8px; text-align: center;">
          <div id="efficiency-score" style="color: #FF9800; font-size: 24px; font-weight: bold;">0%</div>
          <div style="color: #AAA; font-size: 12px;">Time Efficiency</div>
        </div>
        <div class="criteria-card" style="background: #333; padding: 15px; border-radius: 8px; text-align: center;">
          <div id="documentation-score" style="color: #4CAF50; font-size: 24px; font-weight: bold;">0%</div>
          <div style="color: #AAA; font-size: 12px;">Documentation</div>
        </div>
      </div>
      
      <!-- Overall Score -->
      <div class="overall-score" style="background: #333; padding: 20px; border-radius: 8px; text-align: center;">
        <h5 style="color: #FFFFFF; margin-bottom: 10px;">Overall Performance Score</h5>
        <div id="overall-score" style="color: #9C27B0; font-size: 36px; font-weight: bold;">0%</div>
        <div id="performance-grade" style="color: #AAA; font-size: 14px; margin-top: 5px;">Not Started</div>
      </div>
      
      <!-- Assessment Details -->
      <div class="assessment-details" style="background: #333; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <h5 style="color: #FFFFFF; margin-bottom: 15px;">Assessment Details</h5>
        <div id="assessment-details-content" style="color: #AAA; font-size: 12px;">
          No assessment data available
        </div>
      </div>
    </div>
  `;
}

// Add Scenario Selector Event Listeners
function addScenarioSelectorEventListeners() {
  document.querySelectorAll('.start-scenario-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const scenarioId = this.dataset.scenario;
      startScenario(scenarioId);
    });
  });
}

// Add Scenario Interface Event Listeners
function addScenarioInterfaceEventListeners() {
  document.getElementById('prev-step-btn')?.addEventListener('click', previousStep);
  document.getElementById('complete-step-btn')?.addEventListener('click', completeCurrentStep);
  document.getElementById('next-step-btn')?.addEventListener('click', nextStep);
  document.getElementById('pause-scenario-btn')?.addEventListener('click', pauseScenario);
  document.getElementById('reset-scenario-btn')?.addEventListener('click', resetScenario);
  document.getElementById('end-scenario-btn')?.addEventListener('click', endScenario);
}

// Start Scenario
function startScenario(scenarioId) {
  const scenario = scenarioData.scenarios[scenarioId];
  if (!scenario) return;
  
  scenarioData.currentScenario = scenario;
  scenarioData.scenarioStep = 0;
  scenarioData.progress.startTime = new Date();
  scenarioData.progress.completedSteps = [];
  
  // Show scenario interface
  document.querySelector('.scenario-interface').style.display = 'block';
  document.getElementById('active-scenario-title').textContent = scenario.title;
  
  // Load first step
  loadScenarioStep(0);
  
  showNotification(`Scenario "${scenario.title}" started`, 'success');
}

// Load Scenario Step
function loadScenarioStep(stepIndex) {
  const scenario = scenarioData.currentScenario;
  if (!scenario || stepIndex >= scenario.steps.length) return;
  
  const step = scenario.steps[stepIndex];
  scenarioData.scenarioStep = stepIndex;
  
  // Update interface
  document.getElementById('current-step-title').textContent = step.title;
  document.getElementById('current-step-description').textContent = step.description;
  
  // Load tasks
  const tasksList = document.getElementById('current-tasks-list');
  tasksList.innerHTML = step.tasks.map(task => `
    <div class="task-item" style="display: flex; align-items: center; gap: 10px;">
      <input type="checkbox" class="task-checkbox" style="width: 16px; height: 16px;">
      <span style="color: #FFFFFF; font-size: 14px;">${task}</span>
    </div>
  `).join('');
  
  // Load safety checks
  const safetyList = document.getElementById('current-safety-list');
  safetyList.innerHTML = step.safetyChecks.map(check => `
    <div class="safety-item" style="display: flex; align-items: center; gap: 10px;">
      <input type="checkbox" class="safety-checkbox" style="width: 16px; height: 16px;">
      <span style="color: #F44336; font-size: 14px;">${check}</span>
    </div>
  `).join('');
  
  // Update progress
  updateProgress();
  
  // Initialize required simulations
  initializeRequiredSimulations(step.simulations);
}

// Complete Current Step
function completeCurrentStep() {
  const tasks = document.querySelectorAll('.task-checkbox');
  const safetyChecks = document.querySelectorAll('.safety-checkbox');
  
  const tasksCompleted = Array.from(tasks).every(task => task.checked);
  const safetyCompleted = Array.from(safetyChecks).every(check => check.checked);
  
  if (!tasksCompleted) {
    showNotification('Please complete all required tasks before proceeding', 'warning');
    return;
  }
  
  if (!safetyCompleted) {
    showNotification('Please complete all safety checks before proceeding', 'error');
    scenarioData.progress.safetyViolations++;
    return;
  }
  
  // Mark step as completed
  const stepIndex = scenarioData.scenarioStep;
  scenarioData.progress.completedSteps.push(stepIndex);
  
  showNotification('Step completed successfully', 'success');
  
  // Move to next step or end scenario
  if (stepIndex < scenarioData.currentScenario.steps.length - 1) {
    nextStep();
  } else {
    endScenario();
  }
}

// Next Step
function nextStep() {
  const nextStepIndex = scenarioData.scenarioStep + 1;
  if (nextStepIndex < scenarioData.currentScenario.steps.length) {
    loadScenarioStep(nextStepIndex);
  }
}

// Previous Step
function previousStep() {
  const prevStepIndex = scenarioData.scenarioStep - 1;
  if (prevStepIndex >= 0) {
    loadScenarioStep(prevStepIndex);
  }
}

// Update Progress
function updateProgress() {
  const scenario = scenarioData.currentScenario;
  if (!scenario) return;
  
  const progress = (scenarioData.progress.completedSteps.length / scenario.steps.length) * 100;
  scenarioData.progress.elapsedTime = Math.floor((new Date() - scenarioData.progress.startTime) / 1000 / 60);
  
  document.getElementById('progress-percentage').textContent = Math.round(progress) + '%';
  document.getElementById('progress-bar').style.width = progress + '%';
  
  // Update assessment scores
  updateAssessmentScores();
}

// Update Assessment Scores
function updateAssessmentScores() {
  const progress = scenarioData.progress;
  const scenario = scenarioData.currentScenario;
  
  // Safety Compliance (based on safety violations)
  const safetyScore = Math.max(0, 100 - (progress.safetyViolations * 20));
  scenarioData.assessment.safetyCompliance = safetyScore;
  
  // Technical Accuracy (based on completed steps)
  const technicalScore = (progress.completedSteps.length / scenario.steps.length) * 100;
  scenarioData.assessment.technicalAccuracy = technicalScore;
  
  // Time Efficiency (based on elapsed time vs estimated time)
  const timeEfficiency = Math.max(0, 100 - ((progress.elapsedTime - scenario.estimatedTime) / scenario.estimatedTime) * 100);
  scenarioData.assessment.timeEfficiency = Math.min(100, timeEfficiency);
  
  // Documentation (simplified scoring)
  const documentationScore = progress.completedSteps.length * 20;
  scenarioData.assessment.documentation = Math.min(100, documentationScore);
  
  // Overall Score
  const overallScore = (safetyScore + technicalScore + timeEfficiency + documentationScore) / 4;
  scenarioData.assessment.overallScore = overallScore;
  
  // Update display
  document.getElementById('safety-score').textContent = Math.round(safetyScore) + '%';
  document.getElementById('technical-score').textContent = Math.round(technicalScore) + '%';
  document.getElementById('efficiency-score').textContent = Math.round(timeEfficiency) + '%';
  document.getElementById('documentation-score').textContent = Math.round(documentationScore) + '%';
  document.getElementById('overall-score').textContent = Math.round(overallScore) + '%';
  
  // Update grade
  const grade = getPerformanceGrade(overallScore);
  document.getElementById('performance-grade').textContent = grade;
}

// Get Performance Grade
function getPerformanceGrade(score) {
  if (score >= 90) return 'A - Excellent';
  if (score >= 80) return 'B - Good';
  if (score >= 70) return 'C - Satisfactory';
  if (score >= 60) return 'D - Needs Improvement';
  return 'F - Unsatisfactory';
}

// Get Difficulty Color
function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 'low': return '#4CAF50';
    case 'medium': return '#FF9800';
    case 'high': return '#F44336';
    default: return '#666';
  }
}

// Initialize Required Simulations
function initializeRequiredSimulations(simulationTypes) {
  // This function would initialize the specific simulations needed for the current step
  console.log('Initializing simulations:', simulationTypes);
  
  // Example: Initialize specific simulations based on step requirements
  simulationTypes.forEach(type => {
    switch (type) {
      case 'emergency-stop':
        if (typeof initializeEmergencyStopSimulation === 'function') {
          initializeEmergencyStopSimulation();
        }
        break;
      case 'plc':
        if (typeof initializePLCSimulation === 'function') {
          initializePLCSimulation();
        }
        break;
      case 'hmi':
        if (typeof initializeHMISimulation === 'function') {
          initializeHMISimulation();
        }
        break;
      case 'pump':
        if (typeof initializePumpSimulation === 'function') {
          initializePumpSimulation();
        }
        break;
      case 'valve':
        if (typeof initializeValveSimulation === 'function') {
          initializeValveSimulation();
        }
        break;
      case 'float-switch':
        if (typeof initializeFloatSwitchSimulation === 'function') {
          initializeFloatSwitchSimulation();
        }
        break;
      // Add other simulation types as needed
    }
  });
}

// Pause Scenario
function pauseScenario() {
  showNotification('Scenario paused', 'info');
  // Implementation for pausing scenario
}

// Reset Scenario
function resetScenario() {
  if (confirm('Are you sure you want to reset the scenario? All progress will be lost.')) {
    scenarioData.currentScenario = null;
    scenarioData.scenarioStep = 0;
    scenarioData.progress = {
      completedSteps: [],
      currentStep: null,
      startTime: null,
      elapsedTime: 0,
      safetyViolations: 0,
      performanceScore: 0
    };
    scenarioData.assessment = {
      safetyCompliance: 0,
      technicalAccuracy: 0,
      timeEfficiency: 0,
      documentation: 0,
      overallScore: 0
    };
    
    document.querySelector('.scenario-interface').style.display = 'none';
    showNotification('Scenario reset', 'info');
  }
}

// End Scenario
function endScenario() {
  updateAssessmentScores();
  
  const finalScore = scenarioData.assessment.overallScore;
  const grade = getPerformanceGrade(finalScore);
  
  showNotification(`Scenario completed! Final Score: ${Math.round(finalScore)}% (${grade})`, 'success');
  
  // Show final assessment
  document.getElementById('assessment-details-content').innerHTML = `
    <div style="margin-bottom: 10px;">
      <strong>Scenario:</strong> ${scenarioData.currentScenario.title}
    </div>
    <div style="margin-bottom: 10px;">
      <strong>Time Elapsed:</strong> ${scenarioData.progress.elapsedTime} minutes
    </div>
    <div style="margin-bottom: 10px;">
      <strong>Safety Violations:</strong> ${scenarioData.progress.safetyViolations}
    </div>
    <div style="margin-bottom: 10px;">
      <strong>Steps Completed:</strong> ${scenarioData.progress.completedSteps.length}/${scenarioData.currentScenario.steps.length}
    </div>
    <div style="margin-bottom: 10px;">
      <strong>Final Grade:</strong> ${grade}
    </div>
  `;
}

// Show Notification
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : type === 'error' ? '#F44336' : '#2196F3'};
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    z-index: 1000;
    font-weight: bold;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Export functions for global access
window.initializeIndustrialMaintenanceScenario = initializeIndustrialMaintenanceScenario;
window.scenarioData = scenarioData; 