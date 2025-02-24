const { ipcRenderer } = require("electron");

async function loadPokemonList() {
  const pokemonList = await ipcRenderer.invoke("fetch-pokemon-list");
  const listContainer = document.getElementById("pokemon-list");

  if (pokemonList.error) {
    listContainer.innerHTML = `<p>Error: ${pokemonList.error}</p>`;
    return;
  }

  listContainer.innerHTML = "";
  for (let pokemon of pokemonList) {
    const pokeId = pokemon.url.split("/").slice(-2, -1)[0]; // Extrae el ID del URL
    const listItem = document.createElement("div");
    listItem.classList.add("pokemon-item");
    listItem.innerHTML = `
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png" alt="${pokemon.name}">
      <p>${pokemon.name.toUpperCase()}</p>
    `;
    listItem.addEventListener("click", () => loadPokemonDetails(pokemon.name));
    listContainer.appendChild(listItem);
  }
}

async function loadPokemonDetails(pokemon) {
  const data = await ipcRenderer.invoke("fetch-pokemon-details", pokemon);
  const detailsContainer = document.getElementById("pokemon-details");

  if (data.error) {
    detailsContainer.innerHTML = `<p>${data.error}</p>`;
    return;
  }

  detailsContainer.innerHTML = `
    <h2>${data.name.toUpperCase()}</h2>
    <img src="${data.sprites.front_default}" alt="${data.name}">
    <p>Altura: ${data.height} dm</p>
    <p>Peso: ${data.weight} hg</p>
    <p>Tipo(s): ${data.types.map(t => t.type.name).join(", ")}</p>
    <p>Habilidades: ${data.abilities.map(a => a.ability.name).join(", ")}</p>
  `;
}

document.addEventListener("DOMContentLoaded", loadPokemonList);