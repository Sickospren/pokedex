document.addEventListener("DOMContentLoaded", async () => {
    try {
        const statsContainer = document.getElementById("stats-container");

        // Obtener estadísticas desde el proceso principal
        const stats = await window.electronAPI.fetchStats();

        if (stats.error) {
            statsContainer.innerHTML = `<p>Error: ${stats.error}</p>`;
            return;
        }

        // Mostrar estadísticas en HTML
        statsContainer.innerHTML = "<h2>Pokémon por Tipo</h2>";
        stats.forEach(({ tipo, cantidad }) => {
            const tipoElement = document.createElement("p");
            tipoElement.textContent = `${tipo}: ${cantidad} Pokémon`;
            statsContainer.appendChild(tipoElement);
        });

    } catch (error) {
        console.error("Error al cargar estadísticas:", error);
    }
});