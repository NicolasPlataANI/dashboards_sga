# Reglas de Negocio

**RN-01: Origen y Consumo de Datos**
Todos los datos dinámicos, incluyendo listas de proyectos, metadatos (`info_proyecto.json`) y archivos geoespaciales (`.fgb`), deben ser consumidos desde el repositorio GitHub configurado como fuente de verdad (`https://raw.githubusercontent.com/NicolasPlataANI/ani-datos-gis/main/`). No existe base de datos intermedia; el cliente consume estáticos de la rama `main`.

**RN-02: Disponibilidad de Capas en Visor**
Al cargar un proyecto en el visor de mapa, el sistema intentará descargar todas las capas predefinidas. Si una capa no existe (error HTTP 404 u otros) o no contiene elementos vectoriales, dicha capa debe reflejar una cantidad de "0 pts".

**RN-03: Restricción de Interacción con Capas Vacías**
Las capas de inventario GIS que posean una cantidad de "0 pts" deben deshabilitarse en la interfaz del usuario. El usuario no podrá intentar marcar o desmarcar una capa vacía.

**RN-04: Renderizado de Gráfico Treemap**
El gráfico estadístico de Treemap solo debe renderizarse utilizando datos de capas que contengan elementos (cantidad > 0). Las capas sin datos deben ser excluidas del diagrama para evitar distorsiones o errores en la gráfica.

**RN-05: Ajuste de Mapa (Zoom Extent)**
Cuando se cargan las capas de un proyecto, el mapa debe centrarse automáticamente utilizando un `Bounding Box` (BBox) que abarque todos los elementos geográficos cargados con éxito, aplicando un padding (margen) para asegurar que ningún punto quede oculto detrás de los paneles laterales.

**RN-06: Sincronización Tema/Mapa**
Si el usuario se encuentra en el visor y cambia el tema de la aplicación (Claro/Oscuro):
- Si cambia a tema Oscuro, el mapa base debe establecerse en "Oscuro".
- Si cambia a tema Claro, el mapa base debe establecerse en "Calles".
