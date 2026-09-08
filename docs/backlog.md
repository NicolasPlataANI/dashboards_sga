# Product Backlog

A continuación se listan las historias de usuario y tareas de mejora propuestas para futuras iteraciones del sistema (Backlog), priorizadas por su impacto en la experiencia del usuario y calidad del software.

## Alta Prioridad (Próximo Sprint)

* **[TASK-00] Tema Claro por defecto** (✅ Completada)
  * **Descripción:** Cambiar la configuración inicial del sistema para que el modo claro esté habilitado por defecto, en lugar del modo oscuro. 
  * **Justificación:** Requerimiento del usuario para priorizar la lectura en la configuración inicial.

* **[TASK-01] Barra de búsqueda de proyectos** (✅ Completada)
  * **Descripción:** Implementar una barra de búsqueda de texto libre en la vista principal (`ProjectListComponent`) para filtrar proyectos por su nombre.
  * **Justificación:** A medida que se agreguen más meses y proyectos a la lista, la búsqueda manual será ineficiente.

* **[TASK-02] Feedback visual de errores (Manejo de Errores)** (✅ Completada)
  * **Descripción:** Reemplazar las fallas silenciosas en peticiones HTTP (donde actualmente se captura el error y se devuelve `null` o listas vacías) por alertas visuales o modales amigables (ej. "No se pudo cargar la información del proyecto").
  * **Justificación:** Mejorar la experiencia de usuario cuando haya problemas de red o indisponibilidad en el repositorio de GitHub.

* **[TASK-03] Automatización de despliegue (CI/CD)** (✅ Completada)
  * **Descripción:** Configurar GitHub Actions utilizando la dependencia `angular-cli-ghpages` para compilar y desplegar automáticamente en GitHub Pages cada vez que se haga un push a `main`.

## Media Prioridad

* **[TASK-04] Clustering de marcadores en mapa** (✅ Completada)
  * **Descripción:** Implementar `Leaflet.markercluster` u otra estrategia para agrupar marcadores cuando haya una alta densidad de puntos en geometrías grandes, evitando lentitud al renderizar.
  * **Justificación:** Mejorar el rendimiento de Leaflet al alejar el zoom si hay decenas de miles de activos (ej. Señales Verticales o Luminarias).

* **[TASK-05] Pruebas Unitarias (Unit Testing)** (✅ Completada)
  * **Descripción:** Desarrollar pruebas unitarias utilizando el runner `Vitest` configurado en el proyecto, cubriendo principalmente las funciones de agrupación de meses y la lógica de activación/desactivación de capas del mapa.

## Baja Prioridad (Deseables)

* **[TASK-06] Internacionalización (i18n)** (✅ Completada)
  * **Descripción:** Implementar un sistema de traducciones para permitir a los usuarios visualizar los tableros y mapas en inglés o en otros idiomas.
  
* **[TASK-07] Animaciones de transición** (✅ Completada)
  * **Descripción:** Agregar transiciones suaves en Angular Animations entre la navegación de la lista de proyectos y la entrada al visor de mapas.
