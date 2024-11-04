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
      handleDisconnection();
      return;
    }

    plc.readAllItems((err, data) => {
      if (err) {
        console.log('Read error:', err);
        if (win && !win.isDestroyed()) {
          win.webContents.send('plc-status', 'PLC Lost Connection');
        }
        handleDisconnection();
      } else {
        const formattedData = {
          'E-Stop': data['DB1,X2.0'],
          'Blue LED': data['DB1,X58.0']
        };

        const currentState = JSON.stringify(formattedData);
        if (lastLoggedState !== currentState) {
          console.log('State changed:', formattedData);
          lastLoggedState = currentState;
        }

        if (win && !win.isDestroyed()) {
          win.webContents.send('plc-data', formattedData);
          win.webContents.send('plc-status', 'Connected to PLC');
        }
      }
    });
  }, 100);
}

function handleDisconnection() {
  if (!isConnected || isReconnecting) return;
  
  console.log('Connection lost');
  isConnected = false;
  
  if (readInterval) {
    clearInterval(readInterval);
    readInterval = null;
  }
  if (logInterval) {
    clearInterval(logInterval);
    logInterval = null;
  }
  
  if (win && !win.isDestroyed()) {
    win.webContents.send('plc-status', 'PLC Lost Connection');
  }
  
  setTimeout(closeAndReconnect, 1000);
}

function initiatePLCConnection() {
  if (isReconnecting) return;
  isReconnecting = true;
  
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
    host: '192.168.0.1',
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
      win.webContents.send('plc-status', 'Connected to PLC');
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
