import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  IpcMainInvokeEvent,
} from 'electron'
import { FileFilter } from 'electron/main'

let mainWindow: BrowserWindow | null

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// const assetsPath =
//   process.env.NODE_ENV === 'production'
//     ? process.resourcesPath
//     : app.getAppPath()

function createWindow() {
  mainWindow = new BrowserWindow({
    // icon: path.join(assetsPath, 'assets', 'icon.png'),
    width: 1100,
    height: 700,
    // backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

async function registerListeners() {
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on('message', (_, message) => {
    console.log(message)
  })
}

async function registerHandlers() {
  ipcMain.handle('dialog:openDirectory', handleDialogOpenDirectory)
  ipcMain.handle('dialog:openFile', handleDialogOpenFile)
}

const handleDialogOpenDirectory = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory'],
  })

  if (!canceled) return filePaths[0]
}

export interface handleDialogOpenFileOptions {
  filters?: FileFilter[]
  title?: string
  buttonLabel?: string
}

const handleDialogOpenFile = async (
  _: IpcMainInvokeEvent,
  opts?: handleDialogOpenFileOptions
) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: opts?.filters,
    title: opts?.title,
    buttonLabel: opts?.buttonLabel,
  })

  if (!canceled) return filePaths[0]
}

app
  .on('ready', createWindow)
  .whenReady()
  .then(() => {
    registerListeners()
    registerHandlers()
  })
  .catch(e => console.error(e))

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
