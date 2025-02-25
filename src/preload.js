const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  fetchPokemonList: () => ipcRenderer.invoke("fetch-pokemon-list"),
  fetchPokemonDetails: (pokemon) => ipcRenderer.invoke("fetch-pokemon-details", pokemon),
  comprobarLogin: (user, pass) => ipcRenderer.invoke("comprobar-login", user, pass),
  registrarUsuario: (user, pass) => ipcRenderer.invoke("registrar-usuario", user, pass),
  openDetailsWindow: (pokemon) => ipcRenderer.send("open-details-window", pokemon),
  closeDetailsWindow: () => ipcRenderer.send("close-details-window"),
  onPokemonData: (callback) => ipcRenderer.on("pokemon-data", (_, data) => callback(data)),

  openInicio: () => ipcRenderer.send("open-inicio"),
  openPokedex: () => ipcRenderer.send("open-pokedex"),
  openTeams: () => ipcRenderer.send("open-teams"),
  closeTeamsWindow: () => ipcRenderer.send("close-teams-window"),
  closePokedexWindow: () => ipcRenderer.send("close-pokedex-window"),
});
