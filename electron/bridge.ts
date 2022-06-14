import { contextBridge, ipcRenderer } from 'electron'
import { HandleDialogOpenFileOptions } from './main'

export const api = {
  /**
   * Here you can expose functions to the renderer process
   * so they can interact with the main (electron) side
   * without security problems.
   *
   * The function below can accessed using `window.Main.sendMessage`
   */

  sendMessage: (message: string) => {
    ipcRenderer.send('message', message)
  },

  selectDirectory: (): Promise<string | undefined> =>
    ipcRenderer.invoke('dialog:openDirectory'),
  selectFile: (
    opts?: HandleDialogOpenFileOptions
  ): Promise<string | undefined> => ipcRenderer.invoke('dialog:openFile', opts),

  authenticate: (clientSecretFilePath: string): Promise<void> =>
    ipcRenderer.invoke('avu:authenticate', clientSecretFilePath),

  getStoredToken: () => ipcRenderer.invoke('avu:getStoredToken'),

  /**
   * Provide an easier way to listen to events
   */
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  },
}

contextBridge.exposeInMainWorld('Main', api)
