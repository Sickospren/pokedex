# Pokédex en Electron

Una aplicación de Pokédex creada con Electron, Axios y data-forge.js que muestra los primeros 151 Pokémon y permite ver sus detalles.

## Características

- **Lista de Pokémon**: Muestra toda la poekedex
- **Detalles de Pokémon**: Al hacer clic en un Pokémon, se abre una nueva ventana con su información detallada.
- **Buscador**: Filtra los Pokémon por nombre.
- **Configurador de equipos**: Crea equipos de 6 pokemons
- **Estadísticas**: Calcula y muestra estadísticas sobre los tipos de Pokémon o tus equipos usando data-forge.js.

## Tecnologías utilizadas

- **Electron**: Para la creación de la aplicación de escritorio.
- **Axios**: Para realizar llamadas a la PokéAPI.
- **PokéAPI**: Fuente de datos para los Pokémon.
- **data-forge.js**: Para análisis y manipulación de datos.
- **firebase**: Guardar datos de los usuarios

## Instalación y ejecución

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Sickospren/pokedex.git
   cd pokedex
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar la aplicación:
   ```bash
   npm start
   ```

## Estructura del proyecto

```
📂 pokedex-electron
├── 📂 src
│   ├── 📂 renders         # Scripts de renderizado para cada vista
│   │   ├── 📜 rendererDetalles.js
│   │   ├── 📜 rendererEquipos.js
│   │   ├── 📜 rendererIndex.js
│   │   ├── 📜 rendererPokedex.js
│   │   ├── 📜 rendererStats.js
│   ├── 📂 views           # Archivos HTML de las vistas
│   │   ├── 📜 detalles.html
│   │   ├── 📜 equipos.html
│   │   ├── 📜 inicio.html
│   │   ├── 📜 pokedex.html
│   │   ├── 📜 stats.html
│   ├── 📜 firebase.js     # Configuración de Firebase
│   ├── 📜 index.js        # Entrada principal del proceso Renderer
│   ├── 📜 preload.js      # Exposición segura de métodos a Renderer
│   ├── 📜 index.html      # Página principal
│   ├── 📜 index.css       # Estilos de la aplicación
├── 📜 .gitignore         # Archivos ignorados en Git
├── 📜 forge.config.js    # Configuración de Electron Forge
├── 📜 package.json       # Configuración del proyecto
├── 📜 package-lock.json  # Archivo de dependencias
```



