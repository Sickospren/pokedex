// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  fetchPokemonList: () => ipcRenderer.invoke("fetch-pokemon-list"),
  fetchPokemonDetails: (pokemon) => ipcRenderer.invoke("fetch-pokemon-details", pokemon),
  openDetailsWindow: (pokemon) => ipcRenderer.send("open-details-window", pokemon),
  closeDetailsWindow: () => ipcRenderer.send("close-details-window"),
  onPokemonData: (callback) => ipcRenderer.on("pokemon-data", (_, data) => callback(data)),

  openPokedex: () => ipcRenderer.send("open-pokedex"),
  openTeams: () => ipcRenderer.send("open-teams"),
  closeTeamsWindow: () => ipcRenderer.send("close-teams-window"),
  closePokedexWindow: () => ipcRenderer.send("close-pokedex-window"),

});
