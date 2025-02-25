document.addEventListener("DOMContentLoaded", async () => {
    const user = localStorage.getItem('username');
    const result = await window.electronAPI.obtenerEquipos(user);

    const tableContainer = document.getElementById("equiposTabla");

    // Si el resultado tiene equipos, construimos la tabla
    if (result && Object.keys(result).length > 0) {
        const table = document.createElement("table");
        table.classList.add("equipos-table");
        const header = table.createTHead();
        const headerRow = header.insertRow();
        for (let i = 1; i <= 7; i++) {
            const th = document.createElement("th");
            if (i <= 6) {
                th.textContent = `Pokémon ${i}`;
            } else {
                th.textContent = "Eliminar";
            }
            headerRow.appendChild(th);
        }
        const tbody = table.createTBody();
        for (const docId in result) {
            const equipo = result[docId];
            const row = tbody.insertRow();

            // Recorremos el array de Pokémon
            equipo.forEach((pokemon, index) => {
                const cell = row.insertCell();
                const pokeImage = document.createElement("img");
                pokeImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
                pokeImage.alt = pokemon.nombre;
                pokeImage.style.width = "50px";
                const pokeName = document.createElement("p");
                pokeName.textContent = pokemon.nombre;
                cell.appendChild(pokeImage);
                cell.appendChild(pokeName);
            });

            const deleteCell = row.insertCell();
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.classList.add("delete-button");
            deleteButton.addEventListener("click", async () => {
                const isDeleted = await window.electronAPI.eliminarEquipo(docId);
                if (isDeleted) {
                    alert("Equipo eliminado exitosamente.");
                    row.remove();
                } else {
                    alert("Hubo un error al eliminar el equipo.");
                }
            });
            deleteCell.appendChild(deleteButton);
        }
        tableContainer.appendChild(table);
    } else {
        const noDataMessage = document.createElement("p");
        noDataMessage.textContent = "No tienes equipos registrados.";
        tableContainer.appendChild(noDataMessage);
    }
});
