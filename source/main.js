const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    // fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('source/index.html')
  
  /* $("#test").text("ciaooooo"); */
}

app.whenReady().then(() => {
  createWindow()
})
