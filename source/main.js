const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    // fullscreen: true,
    autoHideMenuBar: true,
  })

  win.loadFile('source/index.html')
}

app.whenReady().then(() => {
  createWindow()
})