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

ipcMain.on('update-plc-address', (_, address) => {
    plcAddress = address;
    console.log('PLC address updated:', plcAddress);
});

ipcMain.on('connect-plc', () => {
    console.log('Connect PLC request received');
    if (plc) {
        try {
            plc.dropConnection();
        } catch (error) {
            console.log('Error dropping existing connection:', error);
        }
    }
    initiatePLCConnection();
});

function startReadLoop() {
    if (readInterval) {
        clearInterval(readInterval);
        readInterval = null;
    }

    readInterval = setInterval(() => {
        if (!plc || !isConnected) {
            console.log('No PLC instance or not connected');
            if (win && !win.isDestroyed()) {
                win.webContents.send('plc-status', 'PLC Lost Connection');
            }
            return;
        }

        const startTime = Date.now();
        plc.readAllItems((err, data) => {
            const responseTime = Date.now() - startTime;
            
            if (err) {
                console.log('Read error:', err);
                if (win && !win.isDestroyed()) {
                    win.webContents.send('plc-status', 'PLC Lost Connection');
                }
            } else {
                console.log('Read data:', data);
                
                const formattedData = {
                    'E-Stop': data['DB1,X2.0'],
                    'Blue LED': data['DB1,X58.0']
                };

                console.log('Sending formatted data to renderer:', formattedData);

                updateHistoricalData(formattedData);

                if (win && !win.isDestroyed()) {
                    win.webContents.send('plc-data', formattedData);
                    win.webContents.send('plc-status', 'Connected to PLC');
                    win.webContents.send('stats-update', {
                        connectionStats,
                        historicalData
                    });
                }
            }
        });
    }, 1000);
}

function handleDisconnection() {
    isConnected = false;
    updateConnectionStats(null, new Error('Connection lost'));
    
    if (!isReconnecting) {
        setTimeout(initiatePLCConnection, 5000);
    }
}

function initiatePLCConnection() {
  if (isReconnecting) return;
  isReconnecting = true;
  
  console.log('Initiating PLC connection to:', plcAddress);

  if (plc) {
    try {
      plc.dropConnection();
    } catch (error) {
      console.log('Error dropping existing connection:', error);
    }
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
      console.log('Connection error:', err);
      isConnected = false;
      isReconnecting = false;
      if (win && !win.isDestroyed()) {
        win.webContents.send('plc-status', 'PLC Connection Failed');
      }
      setTimeout(initiatePLCConnection, 5000);
    } else {
      console.log('Connected to PLC');
      
      const variables = {
        'E-Stop': 'DB1,X2.0',
        'Blue LED': 'DB1,X58.0'
      };
      
      plc.addItems([variables['E-Stop'], variables['Blue LED']]);
      console.log('Items added:', variables);
      
      isConnected = true;
      isReconnecting = false;
      if (win && !win.isDestroyed()) {
        win.webContents.send('plc-status', 'Connected to PLC');
      }
      startReadLoop();
    }
  });
}

function closeAndReconnect() {
  if (!plc || isReconnecting) return;
  
  console.log('Initiating reconnection...');
  isReconnecting = true;
  
  if (readInterval) {
    clearInterval(readInterval);
    readInterval = null;
  }

  try {
    plc.dropConnection(() => {
      plc = null;
      isConnected = false;
      isReconnecting = false;
      setTimeout(initiatePLCConnection, 5000);
    });
  } catch (error) {
    console.log('Error during disconnect:', error);
    plc = null;
    isConnected = false;
    isReconnecting = false;
    setTimeout(initiatePLCConnection, 5000);
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
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
    
    // Always push the current connection state
    connectionStats.connectionHistory.push({
        time: timestamp,
        connected: isConnected  // Use the global isConnected state
    });

    if (error) {
        connectionStats.errorCount++;
        connectionStats.lastErrors.push({
            time: timestamp,
            error: error.message
        });
        // Keep only last 10 errors
        if (connectionStats.lastErrors.length > 10) {
            connectionStats.lastErrors.shift();
        }
    }

    // Keep last 60 connection status updates
    if (connectionStats.connectionHistory.length > 60) {
        connectionStats.connectionHistory.shift();
    }

    // Send updated stats to renderer
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
