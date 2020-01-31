const path = require('path');
const { app, BrowserWindow } = require('electron');

// require('electron-reload')(__dirname);

let win;

function createMainWindow() {
  win = new BrowserWindow({
    width: 450,
    height: 300,
    webPreferences: { nodeIntegration: true, devTools: false },
    autoHideMenuBar: true,
    resizable: false,
  });

  win.loadFile('./index.html');
  win.removeMenu();
  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createMainWindow();
  }
});

// const ConvertPdf = require("./ConvertPdf");

async function converter() {
  // const pdf = new ConvertPdf(path.resolve(__dirname, "..", "janeiro.pdf"));
  // await pdf.convert();
  // pdf.exportAsCsv(path.resolve(__dirname, "..", "teste1"));
}

// main();
