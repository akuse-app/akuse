const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
  const authWindow  = new BrowserWindow({
    width: 1280,
    height: 720,
    // fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  authWindow.loadFile('source/index.html');
  
  
  function handleLogin() {
    let authUrl = "https://anilist.co/api/v2/oauth/authorize?client_id={}&redirect_uri=http://localhost/GitHub/akuse/source/&response_type=code"

    authWindow.loadURL(authUrl).then(() => {
      const currentURL = authWindow.webContents.getURL()
      console.log(currentURL)
    });
  }
}

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong');
  createWindow();
})