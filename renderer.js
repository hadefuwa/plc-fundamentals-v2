// Get references to our elements
const statusText = document.getElementById('status-text');
const plcData = document.getElementById('plc-data');
const estopCircle = document.getElementById('estop-circle');
const ledCircle = document.getElementById('led-circle');

let lastState = null;

// Set initial state of PLC data
plcData.innerHTML = 'PLC Data: Waiting for connection...';

// Handle connection status using the exposed electronAPI
window.electronAPI.onPLCStatus((event, message) => {
    statusText.innerText = message;
    statusText.classList.remove('connected', 'disconnected');
    statusText.classList.add(message === 'Connected to PLC' ? 'connected' : 'disconnected');

    // Update waiting message if disconnected
    if (message !== 'Connected to PLC') {
        plcData.innerHTML = 'PLC Data: Waiting for connection...';
        // Reset circles when disconnected
        estopCircle.classList.remove('safety-error');
        ledCircle.classList.remove('led-on');
    }
});

// Handle PLC data updates using the exposed electronAPI
window.electronAPI.onPLCData((event, data) => {
    if (!data) return;

    const eStopStatus = data['E-Stop'] ? 'OK' : 'Safety Error';
    const blueLedStatus = data['Blue LED'] ? 'ON' : 'OFF';
    
    // Update E-Stop circle
    estopCircle.classList.toggle('safety-error', !data['E-Stop']);

    // Update Blue LED circle
    ledCircle.classList.toggle('led-on', data['Blue LED']);
    
    // Update status text with conditional styling
    plcData.innerHTML = `
        <div class="status-label" style="color: ${data['E-Stop'] ? 'black' : 'red'}">E-Stop: ${eStopStatus}</div>
        <div class="status-label">Blue LED Lamp: ${blueLedStatus}</div>
    `;
});
