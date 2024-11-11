/**
 * @fileoverview Main process for PLC Communication Application
 * @author Hamed Adefuwa
 * @version 1.0.0
 * @date 2024-03-19
 * 
 * @description
 * This is the main process for an Electron application that communicates with a Siemens S7-1200 PLC.
 * It handles:
 * - PLC communication using nodes7
 * - Real-time data monitoring
 * - Connection management and automatic reconnection
 * - Multiple window management (main, analogue, and details views)
 * - Historical data tracking
 * - Performance monitoring
 * 
 * @requires electron
 * @requires nodes7
 * @requires path
 * @requires ./db1Handler
 * @requires ./dbFaultsHandler
 * 
 * @copyright Copyright (c) 2024 Matrix TSL
 * @license MIT
 */

// Import required Electron modules for app management and window creation
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
// Import nodes7 library for Siemens S7 PLC communication
const nodes7 = require('nodes7');
// Import DB1 structure and handler functions
const db1Structure = require('./db1.json');
const { getDB1Items, formatDB1Data, logDB1Values, getAnalogueWriteAddress } = require('./db1Handler');
// Import DB Faults structure and handler functions
const dbFaultsStructure = require('./dbFaults.json');
const { getDBFaultsItems, formatDBFaultsData, logDBFaultsValues } = require('./dbFaultsHandler');

// Initialize main application variables
let plc = null;                    // PLC connection object
let win;                          // Main application window
let readInterval;                 // Timer for periodic PLC reads
let isReconnecting = false;       // Flag to prevent multiple reconnection attempts
let isConnected = false;          // Current PLC connection status
let logInterval;                  // Timer for logging
let lastLoggedState = null;       // Last logged PLC state

// Track connection statistics and performance metrics
let connectionStats = {
    responseTime: [],             // Store response times for performance monitoring
    errorCount: 0,                // Count of communication errors
    totalRequests: 0,             // Total number of requests made to PLC
    lastErrors: [],               // Store recent error messages
    connectionHistory: []         // Track connection state changes
};

// Store historical data for UI visualization
let historicalData = {
    ledStates: [],               // Track LED state changes over time
    estopEvents: [],             // Track Emergency Stop events
    statusHistory: []            // Track overall system status
};

// PLC connection configuration
let plcAddress = '192.168.0.99';  // Default PLC IP address
let lastEstopState = true;        // Track last known E-Stop state

// Reconnection handling
let reconnectTimer = null;
const RECONNECT_DELAY = 5000;     // Wait 5 seconds between reconnection attempts

// Additional application windows
let analogueWindow = null;        // Window for analogue value display
let detailsWindow = null;         // Window for detailed PLC information

// Application state management
let plcData = {};                 // Current PLC data cache
let lastWriteState = false;       // Track last written state
let statusInterval;               // Timer for status updates

// Logging rate control
let lastLogTime = 0;
const LOG_INTERVAL = 5000;        // Log to console every 5 seconds

// IPC Event Handlers for renderer process communication
ipcMain.on('update-plc-address', (_, address) => {
    plcAddress = address;
    //console.log('PLC address updated:', plcAddress);
});

// Handle PLC connection request from renderer
ipcMain.on('connect-plc', () => {
    //console.log('Connect PLC request received');
    isReconnecting = false;
    clearAllTimers();
    initiatePLCConnection();
});

// Handle request to open analogue value window
ipcMain.on('open-analogue-window', () => {
    if (analogueWindow) {
        analogueWindow.focus();
        return;
    }

    // Create new window for analogue display with larger dimensions
    analogueWindow = new BrowserWindow({
        width: 1200,      // Increased from 800
        height: 800,      // Increased from 600
        minWidth: 800,    // Add minimum size constraints
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    analogueWindow.loadFile('analogue-popup.html');

    // Optional: Start maximized
    // analogueWindow.maximize();

    analogueWindow.on('closed', () => {
        analogueWindow = null;
    });
});

// Handle PLC write requests from renderer
ipcMain.on('write-plc', () => {
    if (plc && isConnected) {
        plc.writeItems('DB1,X60.0', !lastWriteState, (err) => {
            if (err) {
                //console.log('Write error:', err);
            } else {
                //console.log('Write successful, new state:', !lastWriteState);
                lastWriteState = !lastWriteState;
            }
        });
    }
});

// Handle request to open details window
ipcMain.on('open-details', (_, dataType) => {
    createDetailsWindow(dataType);
});

// Utility function to clear all active timers
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

// Handle PLC disconnection events
function handleDisconnection() {
    if (isReconnecting) return;
    
    //console.log('Handling disconnection...');
    isConnected = false;
    isReconnecting = true;
    
    updateConnectionStats(0, new Error('Connection lost'));

    clearAllTimers();

    // Notify renderer of connection loss
    if (win && !win.isDestroyed()) {
        win.webContents.send('plc-status', 'PLC Lost Connection');
    }

    attemptReconnection();
}

// Function to attempt reconnection to the PLC
function attemptReconnection() {
    //console.log('Attempting to reconnect...');
    
    // Clean up existing PLC connection if any
    if (plc) {
        try {
            plc.dropConnection();
        } catch (error) {
            //console.log('Error dropping connection:', error);
        }
        plc = null;
    }

    // Create new PLC instance and attempt connection
    plc = new nodes7({
        silent: true,
        debug: false
    });

    plc.initiateConnection({
        port: 102,               // Standard S7 communication port
        host: plcAddress,        // PLC IP address
        rack: 0,                 // Rack number in hardware config
        slot: 1,                 // Slot number in hardware config
        timeout: 1500,           // Connection timeout in milliseconds
        localTSAP: 0x0100,      // Local TSAP
        remoteTSAP: 0x0200,     // Remote TSAP
    }, (err) => {
        if (err) {
            //console.log('Reconnection failed:', err.message);
            
            if (win && !win.isDestroyed()) {
                win.webContents.send('plc-status', 'Reconnection Failed');
            }
            
            // Schedule another reconnection attempt
            reconnectTimer = setTimeout(() => {
                attemptReconnection();
            }, RECONNECT_DELAY);
        } else {
            //console.log('Reconnected to PLC successfully');
            isConnected = true;
            isReconnecting = false;
            
            // Add items to be monitored
            plc.addItems(getDB1Items());
            plc.addItems(getDBFaultsItems());
            
            //console.log('Items added to PLC');
            
            if (win && !win.isDestroyed()) {
                win.webContents.send('plc-status', 'Connected to PLC');
            }
            
            startReadLoop();
        }
    });
}

// Function to start the cyclic reading of PLC data
function startReadLoop() {
    if (readInterval) {
        clearInterval(readInterval);
    }
    if (statusInterval) {
        clearInterval(statusInterval);
    }

    // Fast interval for PLC data reading (100ms)
    readInterval = setInterval(() => {
        if (!plc || !isConnected) return;

        plc.readAllItems((err, data) => {
            if (err) {
                //console.log('Read error:', err);
                handleDisconnection();
                return;
            }

            // Separate DB1 and DB6 data before formatting
            const db1Data = {};
            const db6Data = {};

            // Sort the data into respective DBs
            Object.entries(data).forEach(([key, value]) => {
                if (key.startsWith('DB1,')) {
                    db1Data[key] = value;
                } else if (key.startsWith('DB6,')) {
                    db6Data[key] = value;
                }
            });

            // Format each DB separately
            const formattedDB1Data = formatDB1Data(db1Data);
            const formattedFaultsData = formatDBFaultsData(db6Data);

            // Create a serializable version of the faults data
            const serializableFaultsData = {
                faults: formattedFaultsData.faults,
                activeFaultCount: formattedFaultsData.activeFaultCount(),
                activeFaults: formattedFaultsData.getActiveFaults()
            };

            // Debug logs
            //console.log('Formatted DB1 Data:', formattedDB1Data);
            //console.log('Formatted Faults Data:', serializableFaultsData);

            // Send to renderer
            if (win && !win.isDestroyed()) {
                win.webContents.send('plc-data', {
                    db1: formattedDB1Data,
                    faults: serializableFaultsData
                });
            }
        });
    }, 100);  // 100ms for PLC data
}

// Function to initiate initial PLC connection
function initiatePLCConnection() {
    clearAllTimers();
    isReconnecting = false;

    // Clean up existing PLC connection if any
    if (plc) {
        try {
            plc.dropConnection();
        } catch (error) {
            //console.log('Error dropping existing connection:', error);
        }
        plc = null;
    }

    try {
        // Create new PLC instance with logging disabled
        plc = new nodes7({
            silent: true,
            debug: false
        });

        // Configure and initiate PLC connection
        plc.initiateConnection({
            port: 102,               // Standard S7 communication port
            host: plcAddress,        // PLC IP address
            rack: 0,                 // Rack number in hardware config
            slot: 1,                 // Slot number in hardware config
            timeout: 1500,           // Connection timeout in milliseconds
            localTSAP: 0x0100,      // Local TSAP
            remoteTSAP: 0x0200,     // Remote TSAP
        }, (err) => {
            if (err) {
                isConnected = false;
                
                if (win && !win.isDestroyed()) {
                    win.webContents.send('plc-status', 'PLC Connection Failed');
                }
                
                handleDisconnection();
            } else {
                isConnected = true;
                isReconnecting = false;
                
                // Add both DB1 and DB6 items to be read
                const db1Items = getDB1Items();
                const db6Items = getDBFaultsItems();
                
                // Add all items to PLC
                plc.addItems([...db1Items, ...db6Items]);
                
                if (win && !win.isDestroyed()) {
                    win.webContents.send('plc-status', 'Connected to PLC');
                }
                
                startReadLoop();
            }
        });

    } catch (error) {
        console.error('Error initializing PLC:', error);
        if (win && !win.isDestroyed()) {
            win.webContents.send('plc-status', 'PLC Initialization Failed');
        }
        handleDisconnection();
    }
}

// Function to create the main application window
function createWindow() {
    win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: false,        // Disable node integration for security
            contextIsolation: true,        // Enable context isolation
            preload: path.join(__dirname, 'preload.js')  // Use preload script
        },
        show: false  // Don't show until ready
    });

    win.loadFile('index.html');

    // Show window when ready and initiate PLC connection
    win.once('ready-to-show', () => {
        win.maximize();
        win.show();
        
        win.webContents.send('plc-status', 'Connecting to PLC...');
        initiatePLCConnection();
    });

    win.on('closed', () => {
        win = null;
    });

    // Add this to your existing window creation code
    win.webContents.setWindowOpenHandler(({ url }) => {
        // Handle the navigation within the existing window
        win.webContents.loadURL(url);
        return { action: 'deny' }; // Prevents new window from being created
    });
}

// Initialize application when ready
app.whenReady().then(createWindow);

// Handle application quit for non-macOS platforms
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (readInterval) clearInterval(readInterval);
    if (plc) plc.dropConnection();
    app.quit();
  }
});

// Function to update connection statistics and metrics
function updateConnectionStats(responseTime, error) {
    const timestamp = new Date();
    connectionStats.totalRequests++;
    
    // Add connection state to history
    connectionStats.connectionHistory.push({
        time: timestamp,
        connected: isConnected
    });

    // Keep only last 60 connection history entries
    if (connectionStats.connectionHistory.length > 60) {
        connectionStats.connectionHistory.shift();
    }

    // Send updated stats to renderer process
    if (win && !win.isDestroyed()) {
        win.webContents.send('stats-update', {
            connectionStats,
            historicalData
        });
    }
}

// Function to update historical data for UI visualization
function updateHistoricalData(data) {
    const timestamp = new Date();

    // Update LED history - using X58.0 (outputs.a[0])
    historicalData.ledStates.push({
        time: timestamp,
        state: data.outputs.a[0]  // X58.0
    });

    // Update E-Stop history - using X2.0 (inputs.a[0].state)
    historicalData.estopEvents.push({
        time: timestamp,
        state: data.inputs.a[0].state  // X2.0
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

    // Send updated stats to the renderer
    if (win && !win.isDestroyed()) {
        win.webContents.send('stats-update', {
            connectionStats,
            historicalData
        });
    }
}

// Clean up resources on app exit
app.on('before-quit', () => {
    clearAllTimers();
    if (plc) {
        try {
            plc.dropConnection();
        } catch (error) {
            //console.log('Error dropping connection on quit:', error);
        }
    }
});

// Function to create and manage the details window
function createDetailsWindow(dataType) {
    // Return focus to existing window if it exists
    if (detailsWindow) {
        detailsWindow.focus();
        return;
    }

    // Create new details window
    detailsWindow = new BrowserWindow({
        width: 1200,      // Increased from default
        height: 800,      // Increased from default
        title: 'PLC Details View',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    detailsWindow.loadFile('plc-details.html');

    // Send initial data when window is ready
    detailsWindow.webContents.on('did-finish-load', () => {
        detailsWindow.webContents.send('init-data', { type: dataType, data: plcData });
    });

    // Clean up on window close
    detailsWindow.on('closed', () => {
        detailsWindow = null;
    });
}

// Example: Sending DB1 data
function sendDB1DataToRenderer(data) {
    if (detailsWindow && !detailsWindow.isDestroyed()) {
        detailsWindow.webContents.send('db1-data', data);
    }
}

// Update the clear-forcing handler
ipcMain.on('clear-forcing', () => {
    if (plc && isConnected) {
        plc.writeItems('DB1,X0.0', true, (err) => {
            if (err) {
                //console.log('Write error:', err);
            } else {
                //console.log('Clear forcing write successful');
                setTimeout(() => {
                    plc.writeItems('DB1,X0.0', false, (err) => {
                        if (err) {
                            //console.log('Write error:', err);
                        } else {
                            //console.log('Clear forcing reset successful');
                        }
                    });
                }, 500);
            }
        });
    }
});

// Update the fault-reset handler
ipcMain.on('fault-reset', () => {
    if (plc && isConnected) {
        plc.writeItems('DB1,X0.1', true, (err) => {
            if (err) {
                //console.log('Write error:', err);
            } else {
                //console.log('Fault reset write successful');
                setTimeout(() => {
                    plc.writeItems('DB1,X0.1', false, (err) => {
                        if (err) {
                            //console.log('Write error:', err);
                        } else {
                            //console.log('Fault reset reset successful');
                        }
                    });
                }, 500);
            }
        });
    }
});

// Add the force-digital handler
ipcMain.on('force-digital', (event, data) => {
    if (plc && isConnected) {
        // Determine the DB offset based on type and bank
        let baseOffset = data.type === 'input' ? 2 : 58;  // 2 for inputs (starting at X2.0), 58 for outputs
        if (data.bank === 'b') {
            baseOffset += data.type === 'input' ? 24 : 82;  // Add 24 for input bank B, 82 for output bank B
        }
        
        // Calculate the specific addresses for this I/O point
        const stateOffset = baseOffset + (data.channel * 2);  // Each digital point starts 2 bytes after the previous one
        const forcedStateAddress = `DB1,X${stateOffset}.1`;  // .1 for ForcedState
        const forcedStatusAddress = `DB1,X${stateOffset}.2`;  // .2 for ForcedStatus

        //console.log(`Writing to addresses: ${forcedStateAddress} and ${forcedStatusAddress}`); // Debug log

        // Write ForcedState (always true when forcing)
        plc.writeItems(forcedStateAddress, true, (err) => {
            if (err) {
                //console.log('Write error (ForcedState):', err);
            } else {
                //console.log(`Force state write successful for ${data.type} ${data.bank}${data.channel}`);
                
                // Write ForcedStatus (true for ON, false for OFF)
                plc.writeItems(forcedStatusAddress, data.forcedStatus, (err) => {
                    if (err) {
                        //console.log('Write error (ForcedStatus):', err);
                    } else {
                        //console.log(`Force status write successful for ${data.type} ${data.bank}${data.channel}`);
                    }
                });
            }
        });
    }
});

// Add this with your other IPC handlers
ipcMain.handle('request-status', async (event) => {
    // Return the current PLC status
    return plc.getStatus();  // Adjust this based on how you store/get PLC status
});

// Add this with your other IPC handlers
ipcMain.on('modify-analogue', async (event, data) => {
    try {
        const { channel, type, value } = data;
        const address = getAnalogueWriteAddress(type, channel);
        
        if (!address) {
            throw new Error('Invalid analogue address');
        }

        plc.writeItems(address, value, (err) => {
            if (err) {
                console.error('Write error:', err);
            } else {
                console.log(`Successfully wrote ${value} to ${address}`);
            }
        });
        
    } catch (error) {
        console.error('Error writing analogue value:', error);
    }
});

