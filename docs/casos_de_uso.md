# Casos de Uso

## CU-01: Consultar Proyectos Disponibles
- **Actor:** Usuario
- **Precondiciones:** La aplicación web está en ejecución y tiene acceso a internet.
- **Flujo Principal:**
  1. El usuario ingresa a la ruta raíz de la aplicación (`/` o vista principal).
  2. El sistema realiza una petición HTTP para obtener `proyectos.json` desde el repositorio fuente.
  3. El sistema agrupa los proyectos primero por su "mes" de avance, y luego internamente por "modo" (Férreo o Carretero).
  4. El sistema renderiza la interfaz mostrando los bloques por meses y, dentro de cada uno, subtítulos correspondientes a los modos que contengan los respectivos proyectos.
- **Flujos Alternativos:**
  - *2a.* Falla la petición (ej. error de red): El sistema captura el error y muestra una vista vacía, sin fallar abruptamente.

## CU-02: Cargar Visor de Mapa de un Proyecto
- **Actor:** Usuario
- **Precondiciones:** El usuario seleccionó un proyecto de la lista, pasando el parámetro `proyecto` en la URL.
- **Flujo Principal:**
  1. El sistema carga el componente del visor (`MapViewerComponent`).
  2. El sistema muestra un indicador de carga animado ("Decodificando binario...").
  3. El sistema obtiene `info_proyecto.json` y actualiza el panel lateral izquierdo.
  4. El sistema inicializa el mapa de Leaflet con una vista por defecto.
  5. En paralelo, el sistema intenta descargar y decodificar todos los archivos `.fgb` del proyecto seleccionado.
  6. A medida que se decodifican, las geometrías de las capas activas se dibujan en el mapa.
  7. El sistema calcula los límites geográficos de todas las capas combinadas (Bounding Box) y ajusta el zoom del mapa para abarcar todo el proyecto.
  8. El sistema renderiza las Tarjetas KPI en el panel inferior con la información de recuentos.
  9. El sistema oculta el indicador de carga.

## CU-03: Interactuar con las Capas Físicas del Mapa
- **Actor:** Usuario
- **Precondiciones:** El visor de mapa del proyecto se ha cargado correctamente (CU-02).
- **Flujo Principal:**
  1. El usuario ubica el panel de Inventario GIS en la barra lateral derecha.
  2. El usuario observa el listado de capas y la cantidad de elementos en cada una.
  3. El usuario desmarca el checkbox de una capa habilitada (ej. "Túneles").
  4. El sistema remueve esa capa vectorial del mapa de Leaflet en tiempo real.
  5. El usuario hace clic en el botón "Nada".
  6. El sistema remueve todas las capas vectoriales actualmente visibles en el mapa.

## CU-04: Analizar Tarjetas de Métricas (KPI Cards)
- **Actor:** Usuario
- **Precondiciones:** El visor se ha cargado y las tarjetas se muestran en la parte inferior.
- **Flujo Principal:**
  1. El usuario observa las tarjetas con los bordes coloreados, indicando el nombre de las capas y sus conteos actualizados.
  2. El sistema adapta el alto del contenedor para ajustarse cómodamente si el proyecto tiene pocas capas.
  3. Si el proyecto cuenta con múltiples capas (ej. modo férreo con +25 elementos), el usuario utiliza la barra de desplazamiento (scroll) vertical interna del contenedor inferior para visualizar las tarjetas restantes sin afectar el tamaño del mapa principal.
