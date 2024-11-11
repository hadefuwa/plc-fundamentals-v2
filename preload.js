const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    receiveData: (callback) => ipcRenderer.on('plc-data', (_, data) => callback(data)),
    receiveStatus: (callback) => ipcRenderer.on('plc-status', (_, status) => callback(status)),
    receiveStats: (callback) => ipcRenderer.on('stats-update', (_, stats) => callback(stats)),
    updatePLCAddress: (address) => ipcRenderer.send('update-plc-address', address),
    connectPLC: () => ipcRenderer.send('connect-plc'),
    writePLC: () => ipcRenderer.send('write-plc'),
    openDetails: (dataType) => ipcRenderer.send('open-details', dataType),
    receiveInitData: (callback) => ipcRenderer.on('init-data', (_, data) => callback(data)),
    receiveDetailData: (callback) => ipcRenderer.on('detail-data', (_, data) => callback(data)),
    forceInput: (address, value) => ipcRenderer.send('force-input', { address, value }),
    clearForcing: () => ipcRenderer.send('clear-forcing'),
    requestIOHistory: (ioPoint) => ipcRenderer.send('request-io-history', ioPoint),
    receiveIOHistory: (callback) => ipcRenderer.on('io-history', (_, data) => callback(data)),
    receiveDB1Data: (callback) => ipcRenderer.on('db1-data', (_, data) => callback(data)),
    receiveAnalogueData: (callback) => ipcRenderer.on('analogue-data', (_, data) => callback(data)),
    openAnalogueWindow: () => ipcRenderer.send('open-analogue-window'),
    sendToMain: (channel, data) => {
        let validChannels = ['force-digital', 'modify-analogue'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    faultReset: () => ipcRenderer.send('fault-reset'),
    onConnectionChange: (callback) => {
        ipcRenderer.on('connection-status', (_, status) => callback(status));
    },
    onPlcStatus: (callback) => {
        ipcRenderer.on('plc-status', (_, status) => callback(status));
    },
    requestStatus: () => ipcRenderer.send('request-status'),
    modifyAnalogue: (channel, type, value) => {
        ipcRenderer.send('modify-analogue', { channel, type, value });
    },
}) 