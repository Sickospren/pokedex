document.addEventListener("DOMContentLoaded", () => {
  window.electronAPI.onPokemonData((data) => {
      const detallesDiv = document.getElementById("detalles");

      if (data.error) {
          detallesDiv.innerHTML = `<p>${data.error}</p>`;
          return;
      }

      // Obtener colores de tipo
      const typeColors = {
          normal: "#A8A77A",
          fire: "#EE8130",
          water: "#6390F0",
          electric: "#F7D02C",
          grass: "#7AC74C",
          ice: "#96D9D6",
          fighting: "#C22E28",
          poison: "#A33EA1",
          ground: "#E2BF65",
          flying: "#A98FF3",
          psychic: "#F95587",
          bug: "#A6B91A",
          rock: "#B6A136",
          ghost: "#735797",
          dragon: "#6F35FC",
          dark: "#705746",
          steel: "#B7B7CE",
          fairy: "#D685AD"
      };

      const types = data.types.map(t => t.type.name);
      const colors = types.map(type => typeColors[type] || "#777");

      // Generar degradado diagonal de tipo1 (esquina superior izq) a tipo2 (esquina inferior der)
      const gradient = `linear-gradient(to bottom right, ${colors[0]}, ${colors[1] || colors[0]})`;

      // Obtener sprites
      const normalSprite = data.sprites.front_default;
      const shinySprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${data.id}.png`;

      // Crear el contenido con mejor diseño
      detallesDiv.innerHTML = `
          <div style="
              background: #fff;
              border-radius: 15px;
              padding: 20px;
              max-width: 400px;
              box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
              text-align: center;
              border: 6px solid transparent;
              border-image: ${gradient} 1;
              margin: 20px auto; /* Reducido margen superior */
          ">
              <h2 style="color: ${colors[0]};">${data.name.toUpperCase()}</h2>
              <div style="display: flex; justify-content: center; gap: 20px; align-items: center;">
                  <img src="${normalSprite}" alt="${data.name} normal" style="width: 100px; height: auto;">
                  <img src="${shinySprite}" alt="${data.name} shiny" style="width: 100px; height: auto;">
              </div>
              <p><strong>Altura:</strong> ${data.height / 10} m</p>
              <p><strong>Peso:</strong> ${data.weight / 10} kg</p>
              <p><strong>Tipo(s):</strong> ${types.map(type => `<span style="color: ${typeColors[type]}; font-weight: bold;">${type}</span>`).join(", ")}</p>
              <p><strong>Habilidades:</strong> ${data.abilities.map(a => a.ability.name).join(", ")}</p>
              <h3>Estadísticas Base</h3>
              <ul style="list-style: none; padding: 0;">
                  ${data.stats.map(stat => `
                      <li>
                          <strong>${stat.stat.name.toUpperCase()}:</strong> ${stat.base_stat}
                      </li>
                  `).join("")}
              </ul>
              <button id="close-details" style="
                  margin-top: 10px;
                  padding: 10px 15px;
                  border: none;
                  background-color: ${colors[0]};
                  color: white;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 16px;
              ">Cerrar</button>
          </div>
      `;

      document.getElementById("close-details").addEventListener("click", () => {
          window.electronAPI.closeDetailsWindow();
      });
  });
});
