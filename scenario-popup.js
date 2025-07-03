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