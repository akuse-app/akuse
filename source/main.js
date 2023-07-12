const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const authWindow  = new BrowserWindow({
    width: 1280,
    height: 720,
    // fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
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
  createWindow()
})


