import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";

const versions = {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  test: () => ipcRenderer.invoke("test")
};

const api = {
  selectDir: (path) => ipcRenderer.invoke("selectDir", path),
  start: (path) => ipcRenderer.invoke("Localization:start", path),
  logging: (callback) => ipcRenderer.on("Localization:logging", callback)
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("versions", versions);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.versions = versions;
  window.api = api;
}