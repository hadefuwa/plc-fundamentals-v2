// Helper function to escape HTML special characters
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Global interactive worksheet function - moved to global scope for easy access
function showInteractiveWorksheet1() {
    console.log('showInteractiveWorksheet1 called');
    
    // Create the popup container
    const popup = document.createElement('div');
    popup.className = 'scenario-popup';
    
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

    // Add Introduction Section
    const introSection = document.createElement('div');
    introSection.className = 'worksheet-section introduction-section';
    introSection.innerHTML = `
        <h3>1. Introduction</h3>
        <div class="section-content">
            <p>${escapeHtml("The system you have in front of you is a Closed-Loop Flow Control system, meaning it continuously adjusts itself to meet a desired target, called the setpoint. It does this by using feedback from sensors to control devices like pumps and valves, keeping the system accurate and stable even if conditions change.")}</p>
            
            <div class="cad-images">
                <figure>
                    <img src="assets/cad.png" alt="CAD Diagram 1" class="cad-image">
                    <figcaption>CAD Model - Front View</figcaption>
                </figure>
                <figure>
                    <img src="assets/cad2.png" alt="CAD Diagram 2" class="cad-image">
                    <figcaption>CAD Model - Side View</figcaption>
                </figure>
            </div>
        </div>
    `;
    content.appendChild(introSection);

    // Add Over To You Section
    const overToYouSection = document.createElement('div');
    overToYouSection.className = 'worksheet-section over-to-you-section';
    overToYouSection.innerHTML = `
        <h3>2. Over To You</h3>
        <div class="section-content">
            <p class="instruction-intro">${escapeHtml("Select Start and observe the system start up. Once the pump is running you should see water flow through the flow gauge. Ensure the hand valve is in the open position, (the handle should be in line with the piping).")}</p>
            
            <div class="steps-container">
                <div class="step-card" data-step="1">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <div class="step-header">
                            <h4>Set a Flow Rate</h4>
                            <label class="step-checkbox">
                                <input type="checkbox" class="step-complete-checkbox">
                                <span class="checkmark"></span>
                            </label>
                        </div>
                        <p>${escapeHtml("Enter a target flow rate on the HMI. You can adjust in increments of 20 using the +/- buttons.")}</p>
                    </div>
                </div>

                <div class="step-card" data-step="2">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <div class="step-header">
                            <h4>Observe Feedback</h4>
                            <label class="step-checkbox">
                                <input type="checkbox" class="step-complete-checkbox">
                                <span class="checkmark"></span>
                            </label>
                        </div>
                        <p>${escapeHtml("Watch the flow sensor reading on the HMI and compare it to the setpoint.")}</p>
                    </div>
                </div>

                <div class="step-card" data-step="3">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <div class="step-header">
                            <h4>Watch the System Adjust</h4>
                            <label class="step-checkbox">
                                <input type="checkbox" class="step-complete-checkbox">
                                <span class="checkmark"></span>
                            </label>
                        </div>
                        <p>${escapeHtml("Note how the pump speed and valve position change to bring the flow rate to the setpoint.")}</p>
                    </div>
                </div>

                <div class="step-card" data-step="4">
                    <div class="step-number">4</div>
                    <div class="step-content">
                        <div class="step-header">
                            <h4>Introduce a Disturbance</h4>
                            <label class="step-checkbox">
                                <input type="checkbox" class="step-complete-checkbox">
                                <span class="checkmark"></span>
                            </label>
                        </div>
                        <p>${escapeHtml("Temporarily restrict the flow (e.g., partially close the shut-off valve) and observe how the system reacts to maintain the flow rate.")}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    content.appendChild(overToYouSection);

    // Add "So What?" section
    const soWhatSection = document.createElement('div');
    soWhatSection.className = 'so-what-section';
    soWhatSection.innerHTML = `
        <h3 class="section-title">So What?</h3>
        <div class="so-what-content">
            <p>This is part of a control system, which automates processes in Industry. At the heart of this system is a PLC (Programmable Logic Controller), a computer that makes real-time decisions based on sensor data. The HMI (Human-Machine Interface) allows you to monitor and adjust settings easily.</p>
            
            <div class="key-point">
                <i class="fas fa-lightbulb"></i>
                <div>
                    <strong>Feedback Control</strong>
                    <p>The system continuously measures the actual flow rate and compares it to the desired setpoint. If there's a difference, it automatically adjusts the pump speed or valve position to correct it.</p>
                </div>
            </div>
            
            <div class="key-point">
                <i class="fas fa-cogs"></i>
                <div>
                    <strong>Real-Time Automation</strong>
                    <p>The PLC processes sensor data and makes control decisions in milliseconds, far faster than any human could react. This ensures consistent, accurate control even when conditions change.</p>
                </div>
            </div>
            
            <div class="key-point">
                <i class="fas fa-shield-alt"></i>
                <div>
                    <strong>Stability & Reliability</strong>
                    <p>Closed-loop systems are self-correcting. If something tries to disturb the process (like partially closing a valve), the system automatically compensates to maintain the desired flow rate.</p>
                </div>
            </div>
            
            <div class="key-point">
                <i class="fas fa-industry"></i>
                <div>
                    <strong>Industrial Applications</strong>
                    <p>These principles are used everywhere in industry - from temperature control in manufacturing to pressure regulation in chemical plants. Understanding this system gives you insight into how modern automation works.</p>
                </div>
            </div>
        </div>
    `;
    content.appendChild(soWhatSection);

    // Add Questions and Answers Section
    const questionsSection = document.createElement('div');
    questionsSection.className = 'questions-section';
    questionsSection.innerHTML = `
        <h3 class="section-title">Questions & Answers</h3>
        <div class="questions-content">
            <div class="instructions">
                <strong>Instructions:</strong> Answer each question based on your observations and understanding of the closed-loop control system. Click "Submit Answer" for each question to see how your response compares to the correct answer.
            </div>
            
            <div class="question-item" data-question="1">
                <h4>Question 1: What is the main purpose of a closed-loop control system?</h4>
                <p>Think about what you observed when you set the flow rate and how the system responded.</p>
                <textarea class="answer-input" data-question="1" placeholder="Enter your answer here..."></textarea>
                <div class="question-actions">
                    <button class="submit-question-btn" onclick="submitQuestion(1)">Submit Answer</button>
                    <span class="submit-note">Your answer will be saved and compared to the correct answer.</span>
                </div>
                <div class="individual-comparison hidden"></div>
            </div>
            
            <div class="question-item" data-question="2">
                <h4>Question 2: Before starting the system, what important check should you perform with the hand valve?</h4>
                <p>Refer to the initial instructions in the "Over To You" section.</p>
                <textarea class="answer-input" data-question="2" placeholder="Enter your answer here..."></textarea>
                <div class="question-actions">
                    <button class="submit-question-btn" onclick="submitQuestion(2)">Submit Answer</button>
                    <span class="submit-note">Your answer will be saved and compared to the correct answer.</span>
                </div>
                <div class="individual-comparison hidden"></div>
            </div>
            
            <div class="question-item" data-question="3">
                <h4>Question 3: What happens when you introduce a disturbance (like partially closing the shut-off valve)?</h4>
                <p>Describe the sequence of events you observed when you restricted the flow.</p>
                <textarea class="answer-input" data-question="3" placeholder="Enter your answer here..."></textarea>
                <div class="question-actions">
                    <button class="submit-question-btn" onclick="submitQuestion(3)">Submit Answer</button>
                    <span class="submit-note">Your answer will be saved and compared to the correct answer.</span>
                </div>
                <div class="individual-comparison hidden"></div>
            </div>
            
            <div class="question-item" data-question="4">
                <h4>Question 4: How does the system "know" when to adjust the pump speed or valve position?</h4>
                <p>Consider the role of feedback in the control system.</p>
                <textarea class="answer-input" data-question="4" placeholder="Enter your answer here..."></textarea>
                <div class="question-actions">
                    <button class="submit-question-btn" onclick="submitQuestion(4)">Submit Answer</button>
                    <span class="submit-note">Your answer will be saved and compared to the correct answer.</span>
                </div>
                <div class="individual-comparison hidden"></div>
            </div>
            
            <div class="question-item" data-question="5">
                <h4>Question 5: What are the key components of this closed-loop control system?</h4>
                <p>List the main components and briefly explain their roles.</p>
                <textarea class="answer-input" data-question="5" placeholder="Enter your answer here..."></textarea>
                <div class="question-actions">
                    <button class="submit-question-btn" onclick="submitQuestion(5)">Submit Answer</button>
                    <span class="submit-note">Your answer will be saved and compared to the correct answer.</span>
                </div>
                <div class="individual-comparison hidden"></div>
            </div>
        </div>
    `;
    content.appendChild(questionsSection);

    // Add the content to the popup
    popup.appendChild(content);
    
    // Add to the document
    document.body.appendChild(popup);
    
    // Initialize step tracking
    initStepTracking();
    
    // Initialize Q&A functionality
    initQuestionsAndAnswers();
    
    // Initialize PID simulation if available
    setTimeout(() => {
        if (typeof initEnhancedPIDSimulation === 'function') {
            initEnhancedPIDSimulation();
        }
    }, 100);
}

// Enhanced PID Simulation Function
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

    // Response test control variables
    let currentTestTimeout = null;
    let isTestRunning = false;

    // Initialize all interactive controls
    setupControls();
    
    function setupControls() {
        // Setpoint control setup
        const setpointSlider = document.getElementById('setpoint-slider');
        if (setpointSlider) {
            setpointSlider.addEventListener('input', (e) => {
                setpoint = parseFloat(e.target.value);
                const valueDisplay = document.getElementById('setpoint-value');
                if (valueDisplay) {
                    valueDisplay.textContent = `${setpoint.toFixed(1)}°C`;
                }
                resetMetrics();
            });
        }

        // PID parameter controls setup
        const kpSlider = document.getElementById('kp-slider');
        const kiSlider = document.getElementById('ki-slider');
        const kdSlider = document.getElementById('kd-slider');

        // Proportional gain control
        if (kpSlider) {
            kpSlider.addEventListener('input', (e) => {
                Kp = parseFloat(e.target.value);
                const valueDisplay = document.getElementById('kp-value');
                if (valueDisplay) {
                    valueDisplay.textContent = Kp.toFixed(2);
                }
                resetMetrics();
            });
        }

        // Integral gain control
        if (kiSlider) {
            kiSlider.addEventListener('input', (e) => {
                Ki = parseFloat(e.target.value);
                const valueDisplay = document.getElementById('ki-value');
                if (valueDisplay) {
                    valueDisplay.textContent = Ki.toFixed(2);
                }
                resetMetrics();
            });
        }

        // Derivative gain control
        if (kdSlider) {
            kdSlider.addEventListener('input', (e) => {
                Kd = parseFloat(e.target.value);
                const valueDisplay = document.getElementById('kd-value');
                if (valueDisplay) {
                    valueDisplay.textContent = Kd.toFixed(2);
                }
                resetMetrics();
            });
        }

        // Challenge mode buttons setup
        const challengeButtons = document.querySelectorAll('.start-challenge');
        challengeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const challenge = e.target.parentElement.dataset.challenge;
                startChallenge(parseInt(challenge));
            });
        });

        // Tab system setup
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                switchTab(tabName);
            });
        });

        // System Response Start Test button setup
        const startResponseButton = document.getElementById('start-response');
        if (startResponseButton) {
            startResponseButton.addEventListener('click', () => {
                startSystemResponseTest();
            });
        }
    }

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
        const riseTimeEl = document.getElementById('rise-time');
        const overshootEl = document.getElementById('overshoot');
        const settlingTimeEl = document.getElementById('settling-time');
        
        if (riseTimeEl) riseTimeEl.textContent = `${riseTime.toFixed(1)}s`;
        if (overshootEl) overshootEl.textContent = `${maxOvershoot.toFixed(1)}%`;
        if (settlingTimeEl) settlingTimeEl.textContent = `${settlingTime.toFixed(1)}s`;
    }

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
        const setpointSlider = document.getElementById('setpoint-slider');
        const setpointValue = document.getElementById('setpoint-value');
        if (setpointSlider) setpointSlider.value = setpoint;
        if (setpointValue) setpointValue.textContent = `${setpoint.toFixed(1)}°C`;
    }

    function switchTab(tabName) {
        // Hide all tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.add('hidden');
        });

        // Remove active class from all buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });

        // Show selected tab content
        const selectedTab = document.getElementById(`${tabName}-tab`);
        if (selectedTab) {
            selectedTab.classList.remove('hidden');
        }

        // Add active class to selected button
        const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }
    }

    function startSystemResponseTest() {
        // Stop any existing test
        if (isTestRunning && currentTestTimeout) {
            clearTimeout(currentTestTimeout);
            isTestRunning = false;
            console.log('Stopped previous test');
        }

        // Get the selected input type
        const inputTypeSelect = document.getElementById('input-type');
        const responseCanvas = document.getElementById('response-canvas');
        
        if (!inputTypeSelect || !responseCanvas) {
            console.error('Response elements not found');
            return;
        }

        const inputType = inputTypeSelect.value;
        const responseCtx = responseCanvas.getContext('2d');
        
        // Clear the response canvas
        responseCtx.fillStyle = '#222';
        responseCtx.fillRect(0, 0, responseCanvas.width, responseCanvas.height);
        
        // Reset the system for testing
        resetMetrics();
        
        // Run the selected test
        runResponseTest(inputType, responseCanvas, responseCtx);
    }

    function runResponseTest(inputType, canvas, ctx) {
        // Mark test as running
        isTestRunning = true;
        
        // Variables for response test
        let testTime = 0;
        let testData = {
            time: [],
            input: [],
            output: []
        };
        
        // Test parameters
        const testDuration = 10; // 10 seconds
        const timeStep = 0.1; // 100ms steps
        
        // Run the test simulation
        function testLoop() {
            // Check if test should stop
            if (!isTestRunning) {
                console.log('Test stopped');
                return;
            }
            
            // Generate input signal based on type
            let inputSignal;
            switch(inputType) {
                case 'step':
                    inputSignal = testTime > 1 ? 75 : 50; // Step from 50 to 75 at t=1s
                    break;
                case 'ramp':
                    inputSignal = 50 + (testTime * 5); // Ramp from 50 at 5 units/second
                    break;
                case 'sine':
                    inputSignal = 50 + 20 * Math.sin(2 * Math.PI * 0.2 * testTime); // Sine wave
                    break;
                default:
                    inputSignal = 50;
            }
            
            // Simulate system response with current PID settings
            const error = inputSignal - processVariable;
            integral += error * timeStep;
            const derivative = (error - lastError) / timeStep;
            
            const output = Kp * error + Ki * integral + Kd * derivative;
            processVariable += output * timeStep;
            lastError = error;
            
            // Add some noise
            processVariable += (Math.random() - 0.5) * 0.1;
            
            // Store test data
            testData.time.push(testTime);
            testData.input.push(inputSignal);
            testData.output.push(processVariable);
            
            // Draw the current state
            drawResponseTest(canvas, ctx, testData);
            
            // Continue test
            testTime += timeStep;
            if (testTime < testDuration) {
                currentTestTimeout = setTimeout(testLoop, 100); // 100ms delay
            } else {
                console.log('Response test completed');
                isTestRunning = false;
                currentTestTimeout = null;
            }
        }
        
        // Start the test
        testLoop();
    }

    function drawResponseTest(canvas, ctx, testData) {
        // Clear canvas
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        // Vertical grid lines
        for (let i = 0; i < canvas.width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal grid lines
        for (let i = 0; i < canvas.height; i += 50) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
            ctx.stroke();
        }
        
        if (testData.time.length < 2) return;
        
        // Draw input signal (green line)
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.beginPath();
        testData.input.forEach((input, i) => {
            const x = (testData.time[i] / 10) * canvas.width;
            const y = canvas.height - ((input - 20) / 80) * canvas.height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
        
        // Draw output signal (blue line)
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 2;
        ctx.beginPath();
        testData.output.forEach((output, i) => {
            const x = (testData.time[i] / 10) * canvas.width;
            const y = canvas.height - ((output - 20) / 80) * canvas.height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
        
        // Draw legend
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Arial';
        ctx.fillText('Input Signal', 10, 20);
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(100, 12, 20, 3);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('System Response', 10, 40);
        ctx.fillStyle = '#2196F3';
        ctx.fillRect(130, 32, 20, 3);
    }
    
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
        const pvValue = document.getElementById('pv-value');
        if (pvValue) {
            pvValue.textContent = `${processVariable.toFixed(1)}°C`;
        }
        updateMetrics();
        
        // Update visualization
        drawVisualization();
        
        // Continue animation loop
        requestAnimationFrame(animate);
    }
    
    function drawVisualization() {
        // Clear canvas
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw background grid
        drawGrid();
        
        // Draw historical data
        drawHistory();
    }

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

    function drawHistory() {
        if (history.sp.length === 0) return;
        
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

// Helper functions for step tracking
function initStepTracking() {
    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach(card => {
        const checkbox = card.querySelector('.step-complete-checkbox');
        const stepNumber = card.dataset.step;
        
        // Load saved state
        const savedState = localStorage.getItem(`step_${stepNumber}_complete`);
        if (savedState === 'true') {
            checkbox.checked = true;
            card.classList.add('completed');
        }
        
        // Save state on change
        checkbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            localStorage.setItem(`step_${stepNumber}_complete`, isChecked);
            
            if (isChecked) {
                card.classList.add('completed');
            } else {
                card.classList.remove('completed');
            }
        });
    });
}

// Helper functions for Q&A
function initQuestionsAndAnswers() {
    // Define correct answers for comparison
    const correctAnswers = {
        1: "The main purpose of a closed-loop control system is to automatically maintain a desired setpoint by continuously measuring the actual value, comparing it to the target, and adjusting the system to minimize the difference (error).",
        2: "Before starting the system, you should ensure the hand valve is in the open position, with the handle aligned with the piping direction.",
        3: "When you introduce a disturbance like partially closing the shut-off valve, the system detects the change in flow rate and automatically adjusts the pump speed or valve position to compensate and maintain the desired flow rate.",
        4: "The system uses feedback from sensors to continuously monitor the actual flow rate and compare it to the setpoint. When there's a difference, the PLC calculates the appropriate control action to correct it.",
        5: "Key components include: PLC (Programmable Logic Controller) for control logic, HMI (Human-Machine Interface) for monitoring and control, flow sensor for feedback, pump for flow generation, control valve for flow regulation, and piping system for fluid transport."
    };

    // Initialize question submission functionality
    window.submitQuestion = function(questionNum) {
        const textarea = document.querySelector(`textarea[data-question="${questionNum}"]`);
        const userAnswer = textarea.value.trim();
        
        if (!userAnswer) {
            alert('Please enter an answer before submitting.');
            return;
        }
        
        // Save the answer
        localStorage.setItem(`worksheet1_question_${questionNum}`, userAnswer);
        
        // Show comparison
        const comparisonDiv = document.querySelector(`[data-question="${questionNum}"] .individual-comparison`);
        comparisonDiv.innerHTML = `
            <div class="answer-comparison">
                <div class="user-answer">
                    <h5>Your Answer:</h5>
                    <p>${escapeHtml(userAnswer)}</p>
                </div>
                <div class="correct-answer">
                    <h5>Model Answer:</h5>
                    <p>${escapeHtml(correctAnswers[questionNum])}</p>
                </div>
            </div>
        `;
        comparisonDiv.classList.remove('hidden');
        
        // Lock the question
        textarea.disabled = true;
        const submitBtn = document.querySelector(`[data-question="${questionNum}"] .submit-question-btn`);
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitted';
    };
    
    // Load saved answers
    for (let i = 1; i <= 5; i++) {
        const savedAnswer = localStorage.getItem(`worksheet1_question_${i}`);
        if (savedAnswer) {
            const textarea = document.querySelector(`textarea[data-question="${i}"]`);
            const submitBtn = document.querySelector(`[data-question="${i}"] .submit-question-btn`);
            
            if (textarea && submitBtn) {
                textarea.value = savedAnswer;
                textarea.disabled = true;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitted';
                
                // Show comparison
                const comparisonDiv = document.querySelector(`[data-question="${i}"] .individual-comparison`);
                comparisonDiv.innerHTML = `
                    <div class="answer-comparison">
                        <div class="user-answer">
                            <h5>Your Answer:</h5>
                            <p>${escapeHtml(savedAnswer)}</p>
                        </div>
                        <div class="correct-answer">
                            <h5>Model Answer:</h5>
                            <p>${escapeHtml(correctAnswers[i])}</p>
                        </div>
                    </div>
                `;
                comparisonDiv.classList.remove('hidden');
            }
        }
    }
}

// Make the function globally accessible
window.showInteractiveWorksheet1 = showInteractiveWorksheet1;

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

    // Make showScenario globally available
    window.showScenario = showScenario;
}); 