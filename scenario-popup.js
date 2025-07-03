// Only initialize scenario functionality if we're on the main page with scenarios
document.addEventListener('DOMContentLoaded', () => {
    // Exit if we're not on a page with scenarios
    if (!document.querySelector('.scenarios-section') && !document.querySelector('.worksheets-section')) return;

    // Load both fault and maintenance scenarios
    let faultScenarios = [];
    let maintenanceScenarios = [];

    // Load scenarios from JSON files
    fetch('dbFaultScenarios.json')
        .then(response => response.json())
        .then(data => {
            faultScenarios = data.scenarios;
        })
        .catch(error => console.error('Error loading fault scenarios:', error));

    fetch('dbMaintenanceScenarios.json')
        .then(response => response.json())
        .then(data => {
            maintenanceScenarios = data.scenarios;
        })
        .catch(error => console.error('Error loading maintenance scenarios:', error));

    // Function to save answers to localStorage
    function saveAnswers(scenarioId, answers) {
        const storageKey = `scenario_${scenarioId}_answers`;
        localStorage.setItem(storageKey, JSON.stringify(answers));
    }

    // Function to load saved answers
    function loadAnswers(scenarioId) {
        const storageKey = `scenario_${scenarioId}_answers`;
        const savedAnswers = localStorage.getItem(storageKey);
        return savedAnswers ? JSON.parse(savedAnswers) : {};
    }

    function showScenario(id, type = 'fault') {
        // Special handling for Worksheet 1
        if (type === 'maintenance' && id === 1) {
            showInteractiveWorksheet1();
            return;
        }

        // Get the correct scenario array based on type
        const scenarios = type === 'fault' ? faultScenarios : maintenanceScenarios;
        const scenario = scenarios.find(s => s.id === id);
        
        if (!scenario) {
            console.error('Scenario not found:', id);
            return;
        }

        // Create popup container
        const popup = document.createElement('div');
        popup.className = 'scenario-popup';
        
        // Create content container
        const content = document.createElement('div');
        content.className = 'scenario-content';
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '×';
        closeButton.onclick = () => popup.remove();
        content.appendChild(closeButton);
        
        // Add title
        const title = document.createElement('h2');
        title.textContent = scenario.title;
        content.appendChild(title);
        
        // Add scenario text
        const textContainer = document.createElement('div');
        textContainer.className = 'scenario-text';
        scenario.paragraphs.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            textContainer.appendChild(p);
        });
        content.appendChild(textContainer);
        
        // Add image
        if (scenario.image) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'scenario-image';
            const img = document.createElement('img');
            // Use the correct directory based on scenario type
            const imageDir = type === 'fault' ? 'scenarios' : 'maintenance';
            img.src = `assets/${imageDir}/${scenario.image}`;
            img.alt = scenario.title;
            imageContainer.appendChild(img);
            content.appendChild(imageContainer);
        }
        
        // Add questions
        const questionsContainer = document.createElement('div');
        questionsContainer.className = 'scenario-questions';
        const questionsTitle = document.createElement('h3');
        questionsTitle.textContent = 'Questions';
        questionsContainer.appendChild(questionsTitle);
        
        scenario.questions.forEach(question => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';
            
            const label = document.createElement('label');
            label.textContent = question.text;
            questionDiv.appendChild(label);
            
            const textarea = document.createElement('textarea');
            textarea.placeholder = question.placeholder || 'Enter your answer here...';
            textarea.id = `${type}_question_${id}_${question.id}`;
            
            // Load saved answer if exists
            const savedAnswer = localStorage.getItem(textarea.id);
            if (savedAnswer) {
                textarea.value = savedAnswer;
            }
            
            // Save answer on change
            textarea.onchange = (e) => {
                localStorage.setItem(textarea.id, e.target.value);
            };
            
            questionDiv.appendChild(textarea);
            questionsContainer.appendChild(questionDiv);
        });
        
        content.appendChild(questionsContainer);
        popup.appendChild(content);
        document.body.appendChild(popup);
    }

    /**
     * Creates and displays the interactive content for Worksheet 1: Closed-Loop Control Systems
     * This worksheet provides a hands-on PID control simulation with:
     * - Real-time PID parameter tuning
     * - Performance metrics visualization
     * - Interactive challenges
     * - System response analysis
     */
    function showInteractiveWorksheet1() {
        // Create the main popup container
        const popup = document.createElement('div');
        popup.className = 'scenario-popup interactive-worksheet';
        
        // Create content container for the worksheet
        const content = document.createElement('div');
        content.className = 'scenario-content';
        
        // Add close button to dismiss the worksheet
        const closeButton = document.createElement('button');
        closeButton.className = 'close-button';
        closeButton.innerHTML = '×';
        closeButton.onclick = () => popup.remove();
        content.appendChild(closeButton);
        
        // Add worksheet title
        const title = document.createElement('h2');
        title.textContent = 'Closed-Loop Control Systems';
        content.appendChild(title);

        // Create the main simulation section with tabs for different features
        const simSection = document.createElement('div');
        simSection.className = 'simulation-section';
        simSection.innerHTML = `
            <h3>PID Control Simulation</h3>
            
            <!-- Tab navigation for different simulation features -->
            <div class="simulation-tabs">
                <button class="tab-button active" data-tab="tuning">PID Tuning</button>
                <button class="tab-button" data-tab="response">System Response</button>
                <button class="tab-button" data-tab="challenges">Challenges</button>
            </div>

            <!-- PID Tuning Interface -->
            <div class="tab-content" id="tuning-tab">
                <!-- Main control panel for setpoint and process variable -->
                <div class="control-panel">
                    <div class="control-group">
                        <label>Setpoint:</label>
                        <input type="range" id="setpoint-slider" min="0" max="100" value="50">
                        <span id="setpoint-value" class="value-display">50.0°C</span>
                    </div>
                    <div class="control-group">
                        <label>Process Variable:</label>
                        <span id="pv-value" class="value-display">25.0°C</span>
                    </div>
                </div>

                <!-- PID Parameter Tuning Panel -->
                <div class="pid-tuning-panel">
                    <h4>PID Parameters</h4>
                    <div class="tuning-controls">
                        <!-- Proportional control -->
                        <div class="control-group">
                            <label>Proportional (Kp):</label>
                            <input type="range" id="kp-slider" min="0" max="2" step="0.1" value="0.5">
                            <span id="kp-value" class="value-display">0.5</span>
                        </div>
                        <!-- Integral control -->
                        <div class="control-group">
                            <label>Integral (Ki):</label>
                            <input type="range" id="ki-slider" min="0" max="1" step="0.05" value="0.1">
                            <span id="ki-value" class="value-display">0.1</span>
                        </div>
                        <!-- Derivative control -->
                        <div class="control-group">
                            <label>Derivative (Kd):</label>
                            <input type="range" id="kd-slider" min="0" max="1" step="0.05" value="0.2">
                            <span id="kd-value" class="value-display">0.2</span>
                        </div>
                    </div>
                    <!-- Real-time performance metrics display -->
                    <div class="performance-metrics">
                        <div class="metric">
                            <label>Rise Time:</label>
                            <span id="rise-time" class="metric-value">0.0s</span>
                        </div>
                        <div class="metric">
                            <label>Overshoot:</label>
                            <span id="overshoot" class="metric-value">0.0%</span>
                        </div>
                        <div class="metric">
                            <label>Settling Time:</label>
                            <span id="settling-time" class="metric-value">0.0s</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- System Response Testing Interface -->
            <div class="tab-content hidden" id="response-tab">
                <div class="response-controls">
                    <div class="control-group">
                        <label>Input Type:</label>
                        <select id="input-type">
                            <option value="step">Step</option>
                            <option value="ramp">Ramp</option>
                            <option value="sine">Sinusoidal</option>
                        </select>
                    </div>
                    <button id="start-response" class="action-button">
                        Start Test
                    </button>
                </div>
                <div class="response-graphs">
                    <canvas id="response-canvas" class="simulation-canvas" width="800" height="300"></canvas>
                </div>
            </div>

            <!-- Interactive Challenges Interface -->
            <div class="tab-content hidden" id="challenges-tab">
                <div class="challenge-list">
                    <!-- Challenge 1: Minimal Overshoot -->
                    <div class="challenge-card" data-challenge="1">
                        <h4>Challenge 1: Minimal Overshoot</h4>
                        <p>Tune the system to achieve less than 5% overshoot</p>
                        <button class="start-challenge">Start</button>
                    </div>
                    <!-- Challenge 2: Fast Response -->
                    <div class="challenge-card" data-challenge="2">
                        <h4>Challenge 2: Fast Response</h4>
                        <p>Achieve settling time under 3 seconds</p>
                        <button class="start-challenge">Start</button>
                    </div>
                    <!-- Challenge 3: Disturbance Rejection -->
                    <div class="challenge-card" data-challenge="3">
                        <h4>Challenge 3: Disturbance Rejection</h4>
                        <p>Maintain stable control with random disturbances</p>
                        <button class="start-challenge">Start</button>
                    </div>
                </div>
            </div>

            <!-- Main simulation canvas for real-time visualization -->
            <canvas id="simulation-canvas" class="simulation-canvas" width="800" height="200"></canvas>
        `;
        content.appendChild(simSection);

        popup.appendChild(content);
        document.body.appendChild(popup);

        // Initialize the simulation and tab system
        initEnhancedPIDSimulation();
        initTabSystem();
    }

    /**
     * Initializes the tab system for switching between different simulation features
     * Handles tab switching and content visibility
     */
    function initTabSystem() {
        const tabs = document.querySelectorAll('.tab-button');
        const contents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Deactivate all tabs
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.add('hidden'));

                // Activate clicked tab
                tab.classList.add('active');
                const content = document.getElementById(`${tab.dataset.tab}-tab`);
                content.classList.remove('hidden');
            });
        });
    }

    /**
     * Initializes the enhanced PID simulation with interactive controls
     * Features:
     * - Real-time PID parameter adjustment
     * - Performance metrics calculation
     * - Historical data plotting
     * - Challenge modes
     */
    function initEnhancedPIDSimulation() {
        const canvas = document.getElementById('simulation-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Initialize simulation variables
        let setpoint = 50;
        let processVariable = 25;
        let integral = 0;
        let lastError = 0;
        
        // PID control parameters
        let Kp = 0.5; // Proportional gain
        let Ki = 0.1; // Integral gain
        let Kd = 0.2; // Derivative gain

        // Performance tracking variables
        let startTime = Date.now();
        let maxOvershoot = 0;
        let settlingTime = 0;
        let riseTime = 0;
        let settled = false;

        // Data history for plotting
        const history = {
            time: [],
            pv: [],    // Process Variable
            sp: [],    // Setpoint
            error: []  // Error
        };

        // Initialize all interactive controls
        setupControls();
        
        /**
         * Sets up all interactive controls and their event handlers
         */
        function setupControls() {
            // Setpoint control setup
            const setpointSlider = document.getElementById('setpoint-slider');
            setpointSlider.addEventListener('input', (e) => {
                setpoint = parseFloat(e.target.value);
                document.getElementById('setpoint-value').textContent = `${setpoint.toFixed(1)}°C`;
                resetMetrics();
            });

            // PID parameter controls setup
            const kpSlider = document.getElementById('kp-slider');
            const kiSlider = document.getElementById('ki-slider');
            const kdSlider = document.getElementById('kd-slider');

            // Proportional gain control
            kpSlider.addEventListener('input', (e) => {
                Kp = parseFloat(e.target.value);
                document.getElementById('kp-value').textContent = Kp.toFixed(2);
                resetMetrics();
            });

            // Integral gain control
            kiSlider.addEventListener('input', (e) => {
                Ki = parseFloat(e.target.value);
                document.getElementById('ki-value').textContent = Ki.toFixed(2);
                resetMetrics();
            });

            // Derivative gain control
            kdSlider.addEventListener('input', (e) => {
                Kd = parseFloat(e.target.value);
                document.getElementById('kd-value').textContent = Kd.toFixed(2);
                resetMetrics();
            });

            // Challenge mode buttons setup
            const challengeButtons = document.querySelectorAll('.start-challenge');
            challengeButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const challenge = e.target.parentElement.dataset.challenge;
                    startChallenge(parseInt(challenge));
                });
            });
        }

        /**
         * Resets all performance metrics and historical data
         */
        function resetMetrics() {
            startTime = Date.now();
            maxOvershoot = 0;
            settlingTime = 0;
            riseTime = 0;
            settled = false;
            integral = 0;
            lastError = 0;
            history.time = [];
            history.pv = [];
            history.sp = [];
            history.error = [];
        }

        /**
         * Updates performance metrics based on current system state
         */
        function updateMetrics() {
            const error = Math.abs(setpoint - processVariable);
            const timeSinceStart = (Date.now() - startTime) / 1000;

            // Calculate overshoot percentage
            const overshoot = Math.max(0, ((processVariable - setpoint) / setpoint) * 100);
            maxOvershoot = Math.max(maxOvershoot, overshoot);

            // Calculate rise time (time to reach 90% of setpoint)
            if (riseTime === 0 && processVariable >= setpoint * 0.9) {
                riseTime = timeSinceStart;
            }

            // Calculate settling time (within 2% of setpoint)
            if (!settled && error <= setpoint * 0.02) {
                settled = true;
                settlingTime = timeSinceStart;
            }

            // Update metrics display
            document.getElementById('rise-time').textContent = `${riseTime.toFixed(1)}s`;
            document.getElementById('overshoot').textContent = `${maxOvershoot.toFixed(1)}%`;
            document.getElementById('settling-time').textContent = `${settlingTime.toFixed(1)}s`;
        }

        /**
         * Initializes a specific challenge scenario
         * @param {number} challengeId - The ID of the challenge to start
         */
        function startChallenge(challengeId) {
            resetMetrics();
            
            switch(challengeId) {
                case 1: // Minimal Overshoot Challenge
                    setpoint = 75;
                    break;
                case 2: // Fast Response Challenge
                    setpoint = 60;
                    break;
                case 3: // Disturbance Rejection Challenge
                    setpoint = 50;
                    // Add random disturbances periodically
                    setInterval(() => {
                        processVariable += (Math.random() - 0.5) * 10;
                    }, 2000);
                    break;
            }
            
            // Update UI to reflect new setpoint
            document.getElementById('setpoint-slider').value = setpoint;
            document.getElementById('setpoint-value').textContent = `${setpoint.toFixed(1)}°C`;
        }
        
        /**
         * Main animation loop for the PID simulation
         * Calculates control output and updates visualization
         */
        function animate() {
            // Calculate PID control values
            const error = setpoint - processVariable;
            integral += error * 0.1; // dt = 0.1 seconds
            const derivative = (error - lastError) / 0.1;
            
            // Calculate PID output
            const output = Kp * error + Ki * integral + Kd * derivative;
            
            // Update process variable based on control output
            processVariable += output * 0.1;
            lastError = error;
            
            // Add some noise to simulate real-world conditions
            processVariable += (Math.random() - 0.5) * 0.2;
            
            // Update historical data
            history.time.push(Date.now());
            history.pv.push(processVariable);
            history.sp.push(setpoint);
            history.error.push(error);

            // Maintain fixed history length
            if (history.time.length > 200) {
                history.time.shift();
                history.pv.shift();
                history.sp.shift();
                history.error.shift();
            }
            
            // Update UI displays
            document.getElementById('pv-value').textContent = `${processVariable.toFixed(1)}°C`;
            updateMetrics();
            
            // Update visualization
            drawVisualization();
            
            // Continue animation loop
            requestAnimationFrame(animate);
        }
        
        /**
         * Draws the complete visualization including grid and data
         */
        function drawVisualization() {
            // Clear canvas
            ctx.fillStyle = '#222';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw background grid
            drawGrid();
            
            // Draw historical data
            drawHistory();
        }

        /**
         * Draws the background grid for the visualization
         */
        function drawGrid() {
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            
            // Draw vertical grid lines
            for (let i = 0; i < canvas.width; i += 50) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
                ctx.stroke();
            }
            
            // Draw horizontal grid lines
            for (let i = 0; i < canvas.height; i += 50) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(canvas.width, i);
                ctx.stroke();
            }
        }

        /**
         * Draws the historical data plots
         */
        function drawHistory() {
            // Draw setpoint history (green line)
            ctx.strokeStyle = '#4CAF50';
            ctx.lineWidth = 2;
            ctx.beginPath();
            history.sp.forEach((sp, i) => {
                const x = (i / history.sp.length) * canvas.width;
                const y = canvas.height - (sp / 100) * canvas.height;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
            
            // Draw process variable history (blue line)
            ctx.strokeStyle = '#2196F3';
            ctx.beginPath();
            history.pv.forEach((pv, i) => {
                const x = (i / history.pv.length) * canvas.width;
                const y = canvas.height - (pv / 100) * canvas.height;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();
        }
        
        // Start the simulation
        animate();
    }

    // Add click event listeners to fault scenario cards (in the scenarios section)
    const scenariosSection = document.querySelector('.scenarios-section');
    if (scenariosSection) {
        const faultCards = scenariosSection.querySelectorAll('.worksheet-card');
        faultCards.forEach(card => {
            const scenarioNum = card.querySelector('.worksheet-number').textContent;
            const scenarioId = parseInt(scenarioNum.match(/\d+/)[0]); // Extract number from "Fault Scenario X"
            card.onclick = () => showScenario(scenarioId, 'fault');
        });
    }

    // Add click event listeners to worksheet cards (in the worksheets section)
    const worksheetsSection = document.querySelector('.worksheets-section');
    if (worksheetsSection) {
        const worksheetCards = worksheetsSection.querySelectorAll('.worksheet-card');
        worksheetCards.forEach(card => {
            const worksheetNum = card.querySelector('.worksheet-number').textContent;
            const scenarioId = parseInt(worksheetNum.match(/\d+/)[0]); // Extract number from "Worksheet X"
            card.onclick = () => showScenario(scenarioId, 'maintenance');
        });
    }

    // Export the function for use in other files
    window.showScenario = showScenario;
}); 