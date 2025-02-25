document.addEventListener("DOMContentLoaded", () => {
  window.electronAPI.onPokemonData((data) => {
    const detallesDiv = document.getElementById("detalles");

    if (data.error) {
      detallesDiv.innerHTML = `<p>${data.error}</p>`;
      return;
    }

    detallesDiv.innerHTML = `
      <h2>${data.name.toUpperCase()}</h2>
      <img src="${data.sprites.front_default}" alt="${data.name}">
      <p>Altura: ${data.height} dm</p>
      <p>Peso: ${data.weight} hg</p>
      <p>Tipo(s): ${data.types.map(t => t.type.name).join(", ")}</p>
      <p>Habilidades: ${data.abilities.map(a => a.ability.name).join(", ")}</p>
    `;

    // Agregar evento al botón
    document.getElementById("close-details").addEventListener("click", () => {
      window.electronAPI.closeDetailsWindow();
    });
  });
});