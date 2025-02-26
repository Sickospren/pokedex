document.addEventListener("DOMContentLoaded", async () => {
    const username = localStorage.getItem('username');


    const contenedor = document.getElementById("contenedorDatos");

    function actualizarContenido(html) {
        contenedor.innerHTML = html;
        contenedor.style.display = "block";
    }

    document.getElementById("btnTop3").addEventListener("click", async () => {
        const top3 = await window.electronAPI.obtenerTop3Pokemons(username);
        const html = `
            <h3>Top 3 Pokémon Más Usados por ${username}</h3>
            <p>
                ${top3.map(poke => `<p>${poke.nombre} (${poke.cantidad} veces)</p>`).join("")}
            </p>
        `;
        actualizarContenido(html);
    });

    document.getElementById("btnTipos").addEventListener("click", async () => {
        const tipos = await window.electronAPI.obtenerTiposUsuario(username);
        const html = `
            <h3>Tipos de Pokémon Más Usados por ${username}</h3>
            <table>
                <tr><th>Tipo</th><th>Cantidad</th></tr>
                ${tipos.map(tipo => `<tr><td>${tipo.tipo}</td><td>${tipo.cantidad}</td></tr>`).join("")}
            </table>
        `;
        actualizarContenido(html);
    });

    document.getElementById("btn151").addEventListener("click", async () => {
        const datos151 = await window.electronAPI.obtenerTipos151();
        const html = `
            <h3>Tipos de Pokémon en los Primeros 151</h3>
            <table>
                <tr><th>Tipo</th><th>Cantidad</th></tr>
                ${datos151.map(tipo => `<tr><td>${tipo.tipo}</td><td>${tipo.cantidad}</td></tr>`).join("")}
            </table>
        `;
        actualizarContenido(html);
    });
});
