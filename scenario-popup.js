// Only initialize scenario functionality if we're on the main page with scenarios
document.addEventListener('DOMContentLoaded', () => {
    const scenarioSection = document.querySelector('.worksheets-section');
    if (!scenarioSection) return; // Exit if we're not on the scenarios page

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
        const scenario = scenarios.find(s => s.id === parseInt(id));
        
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
        const imageContainer = document.createElement('div');
        imageContainer.className = 'scenario-image';
        const img = document.createElement('img');
        img.src = scenario.image;
        img.alt = scenario.title;
        imageContainer.appendChild(img);
        content.appendChild(imageContainer);
        
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
            textarea.placeholder = question.placeholder;
            textarea.id = question.id;
            
            // Load saved answer if exists
            const savedAnswer = localStorage.getItem(`${type}_scenario_${question.id}`);
            if (savedAnswer) {
                textarea.value = savedAnswer;
            }
            
            // Save answer on change
            textarea.onchange = (e) => {
                localStorage.setItem(`${type}_scenario_${question.id}`, e.target.value);
            };
            
            questionDiv.appendChild(textarea);
            questionsContainer.appendChild(questionDiv);
        });
        
        content.appendChild(questionsContainer);
        popup.appendChild(content);
        document.body.appendChild(popup);
    }

    // Add click event listeners to scenario cards
    const cards = document.querySelectorAll('.worksheet-card');
    cards.forEach(card => {
        const scenarioId = parseInt(card.querySelector('.worksheet-number').textContent.split(' ')[2]);
        card.onclick = () => showScenario(scenarioId);
    });

    // Export the function for use in other files
    window.showScenario = showScenario;
}); 