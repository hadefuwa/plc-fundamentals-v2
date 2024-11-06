const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const nodes7 = require('nodes7');

let plc = null;
let win;
let readInterval;
let isReconnecting = false;
let isConnected = false;
let logInterval;
let lastLoggedState = null;

let connectionStats = {
  responseTime: [],
  errorCount: 0,
  totalRequests: 0,
  lastErrors: [],
  connectionHistory: []
};

let historicalData = {
  ledStates: [],
  estopEvents: [],
  statusHistory: []
};

let plcAddress = '192.168.0.1';  // Default address
let lastEstopState = true;

let reconnectTimer = null;
const RECONNECT_DELAY = 5000; // 5 seconds between reconnection attempts

let analogueWindow = null;

let statusInterval;

let lastWriteState = false;

ipcMain.on('update-plc-address', (_, address) => {
    plcAddress = address;
    console.log('PLC address updated:', plcAddress);
});

ipcMain.on('connect-plc', () => {
    console.log('Connect PLC request received');
    isReconnecting = false;
    clearAllTimers();
    initiatePLCConnection();
});

ipcMain.on('open-analogue-window', () => {
    createAnalogueWindow();
});

ipcMain.on('write-plc', () => {
    if (plc && isConnected) {
        plc.writeItems('DB1,X60.0', !lastWriteState, (err) => {
            if (err) {
                console.log('Write error:', err);
            } else {
                console.log('Write successful, new state:', !lastWriteState);
                lastWriteState = !lastWriteState;
            }
        });
    }
});

function clearAllTimers() {
    if (readInterval) {
        clearInterval(readInterval);
        readInterval = null;
    }
    if (statusInterval) {
        clearInterval(statusInterval);
        statusInterval = null;
    }
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
}

function handleDisconnection() {
    if (isReconnecting) return;
    
    console.log('Handling disconnection...');
    isConnected = false;
    isReconnecting = true;
    
    updateConnectionStats(0, new Error('Connection lost'));

    clearAllTimers();

    if (win && !win.isDestroyed()) {
        win.webContents.send('plc-status', 'PLC Lost Connection');
    }

    attemptReconnection();
}

function attemptReconnection() {
    console.log('Attempting to reconnect...');
    
    if (plc) {
        try {
            plc.dropConnection();
        } catch (error) {
            console.log('Error dropping connection:', error);
        }
        plc = null;
    }

    plc = new nodes7({
        silent: true,
        debug: false
    });

    plc.initiateConnection({
        port: 102,
        host: plcAddress,
        rack: 0,
        slot: 1,
        timeout: 1500,
        localTSAP: 0x0100,
        remoteTSAP: 0x0200,
    }, (err) => {
        if (err) {
            console.log('Reconnection failed:', err.message);
            
            if (win && !win.isDestroyed()) {
                win.webContents.send('plc-status', 'Reconnection Failed');
            }
            
            reconnectTimer = setTimeout(() => {
                attemptReconnection();
            }, RECONNECT_DELAY);
        } else {
            console.log('Reconnected to PLC successfully');
            isConnected = true;
            isReconnecting = false;
            
            plc.addItems(['DB1,X2.0', 'DB1,X58.0', 'DB1,REAL32']);
            
            console.log('Items added to PLC');
            
            if (win && !win.isDestroyed()) {
                win.webContents.send('plc-status', 'Connected to PLC');
            }
            
            startReadLoop();
        }
    });
}

function startReadLoop() {
    if (readInterval) {
        clearInterval(readInterval);
    }
    if (statusInterval) {
        clearInterval(statusInterval);
    }

    // Fast interval for PLC data
    readInterval = setInterval(() => {
        if (!plc || !isConnected) return;

        plc.readAllItems((err, data) => {
            if (err) {
                console.log('Read error:', err);
                handleDisconnection();
                return;
            }

            const formattedData = {
                'E-Stop': data['DB1,X2.0'],
                'Blue LED': data['DB1,X58.0'],
                'Analogue Input': data['DB1,REAL32']
            };

            if (win && !win.isDestroyed()) {
                win.webContents.send('plc-data', formattedData);
                if (analogueWindow && !analogueWindow.isDestroyed()) {
                    analogueWindow.webContents.send('plc-data', formattedData);
                }
            }
        });
    }, 100);  // 100ms for PLC data

    // Slower interval for connection status updates
    statusInterval = setInterval(() => {
        updateConnectionStats(0, null);
    }, 1000);  // 1000ms for connection status
}

function initiatePLCConnection() {
    clearAllTimers();
    isReconnecting = false;

    if (plc) {
        try {
            plc.dropConnection();
        } catch (error) {
            console.log('Error dropping existing connection:', error);
        }
        plc = null;
    }

    plc = new nodes7({
        silent: true,
        debug: false
    });

    plc.initiateConnection({
        port: 102,
        host: plcAddress,
        rack: 0,
        slot: 1,
        timeout: 1500,
        localTSAP: 0x0100,
        remoteTSAP: 0x0200,
    }, (err) => {
        if (err) {
            console.log('Connection failed:', err.message);
            isConnected = false;
            
            if (win && !win.isDestroyed()) {
                win.webContents.send('plc-status', 'PLC Connection Failed');
            }
            
            handleDisconnection();
        } else {
            console.log('Connected to PLC successfully');
            isConnected = true;
            isReconnecting = false;
            
            plc.addItems(['DB1,X2.0', 'DB1,X58.0', 'DB1,REAL32']);
            
            console.log('Items added to PLC');
            
            if (win && !win.isDestroyed()) {
                win.webContents.send('plc-status', 'Connected to PLC');
            }
            
            startReadLoop();
        }
    });
}

function createWindow() {
    win = new BrowserWindow({
        width: 1920,          // Default width
        height: 1080,         // Default height
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        show: false          // Don't show until ready
    });

    // Load the index.html file
    win.loadFile('index.html');

    // When ready, maximize and show
    win.once('ready-to-show', () => {
        win.maximize();      // Maximize the window
        win.show();         // Show the window after maximized
    });

    // Optional: If you want true fullscreen (no taskbar)
    // win.setFullScreen(true);

    win.on('closed', () => {
        win = null;
    });

    initiatePLCConnection();
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (readInterval) clearInterval(readInterval);
    if (plc) plc.dropConnection();
    app.quit();
  }
});

function updateConnectionStats(responseTime, error) {
    const timestamp = new Date();
    connectionStats.totalRequests++;
    
    connectionStats.connectionHistory.push({
        time: timestamp,
        connected: isConnected
    });

    if (connectionStats.connectionHistory.length > 60) {
        connectionStats.connectionHistory.shift();
    }

    if (win && !win.isDestroyed()) {
        win.webContents.send('stats-update', {
            connectionStats,
            historicalData
        });
    }
}

function updateHistoricalData(data) {
  const timestamp = new Date();

  // Update LED history
  historicalData.ledStates.push({
    time: timestamp,
    state: data['Blue LED']
  });

  // Update E-Stop history
  historicalData.estopEvents.push({
    time: timestamp,
    state: data['E-Stop']
  });

  // Update general status history
  historicalData.statusHistory.push({
    time: timestamp,
    connected: isConnected,
    hasErrors: connectionStats.lastErrors.length > 0
  });

  // Keep only last 100 entries for each array
  const maxEntries = 100;
  if (historicalData.ledStates.length > maxEntries) {
    historicalData.ledStates.shift();
  }
  if (historicalData.estopEvents.length > maxEntries) {
    historicalData.estopEvents.shift();
  }
  if (historicalData.statusHistory.length > maxEntries) {
    historicalData.statusHistory.shift();
  }
}

// Clean up on app exit
app.on('before-quit', () => {
    clearAllTimers();
    if (plc) {
        try {
            plc.dropConnection();
        } catch (error) {
            console.log('Error dropping connection on quit:', error);
        }
    }
});

function createAnalogueWindow() {
    if (analogueWindow) {
        analogueWindow.focus();
        return;
    }

    analogueWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    analogueWindow.loadFile('analogue-popup.html');

    analogueWindow.on('closed', () => {
        analogueWindow = null;
    });
}
