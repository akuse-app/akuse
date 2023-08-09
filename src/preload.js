const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    openLoginPage: () => ipcRenderer.send('open-login-page')
})