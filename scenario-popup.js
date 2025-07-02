// Only initialize scenario functionality if we're on the main page with scenarios
document.addEventListener('DOMContentLoaded', () => {
    const scenarioSection = document.querySelector('.worksheets-section');
    if (!scenarioSection) return; // Exit if we're not on the scenarios page

    // Load scenarios from JSON file
    let scenarios = [];

    fetch('dbFaultScenarios.json')
        .then(response => response.json())
        .then(data => {
            scenarios = data.scenarios;
        })
        .catch(error => console.error('Error loading scenarios:', error));

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

    // Function to create and show popup
    function showScenarioPopup(scenarioId) {
        const scenario = scenarios.find(s => s.id === scenarioId);
        if (!scenario) return;

        // Create popup container
        const popup = document.createElement('div');
        popup.className = 'scenario-popup';
        
        // Create popup content
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
        title.textContent = `Fault Scenario ${scenario.id}: ${scenario.title}`;
        content.appendChild(title);

        // Add paragraphs
        const textSection = document.createElement('div');
        textSection.className = 'scenario-text';
        scenario.paragraphs.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            textSection.appendChild(p);
        });
        content.appendChild(textSection);

        // Add image
        const imageSection = document.createElement('div');
        imageSection.className = 'scenario-image';
        const img = document.createElement('img');
        img.src = scenario.image;
        img.alt = `Scenario ${scenario.id} diagram`;
        imageSection.appendChild(img);
        content.appendChild(imageSection);

        // Add questions
        const questionsSection = document.createElement('div');
        questionsSection.className = 'scenario-questions';
        const questionTitle = document.createElement('h3');
        questionTitle.textContent = 'Questions';
        questionsSection.appendChild(questionTitle);

        // Load saved answers
        const savedAnswers = loadAnswers(scenarioId);

        // Create form for questions
        const form = document.createElement('form');
        form.onsubmit = (e) => {
            e.preventDefault();
            const answers = {};
            scenario.questions.forEach(question => {
                const input = form.querySelector(`#question_${question.id}`);
                answers[question.id] = input.value;
            });
            saveAnswers(scenarioId, answers);
            alert('Answers saved successfully!');
        };

        scenario.questions.forEach(question => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';

            const label = document.createElement('label');
            label.textContent = question.text;
            label.htmlFor = `question_${question.id}`;
            questionDiv.appendChild(label);

            const input = document.createElement('textarea');
            input.id = `question_${question.id}`;
            input.placeholder = question.placeholder;
            input.value = savedAnswers[question.id] || '';
            input.rows = 4;
            questionDiv.appendChild(input);

            form.appendChild(questionDiv);
        });

        // Add save button
        const saveButton = document.createElement('button');
        saveButton.type = 'submit';
        saveButton.className = 'save-button';
        saveButton.textContent = 'Save Answers';
        form.appendChild(saveButton);

        questionsSection.appendChild(form);
        content.appendChild(questionsSection);

        popup.appendChild(content);
        document.body.appendChild(popup);
    }

    // Add click event listeners to scenario cards
    const cards = document.querySelectorAll('.worksheet-card');
    cards.forEach(card => {
        const scenarioId = parseInt(card.querySelector('.worksheet-number').textContent.split(' ')[2]);
        card.onclick = () => showScenarioPopup(scenarioId);
    });
}); 