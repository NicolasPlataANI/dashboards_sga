# Historias de Usuario

## HU-01: Explorar listado de proyectos
**Como** usuario del sistema,
**Quiero** ver un listado de proyectos de la ANI agrupados por su respectivo mes o periodo de avance,
**Para** poder encontrar y seleccionar fácilmente el proyecto de infraestructura de mi interés.
* **Criterios de Aceptación:**
  - El sistema muestra los proyectos agrupados por mes.
  - Cada proyecto tiene un botón "Acceder" visible.
  - La interfaz se ajusta al tema seleccionado (Claro/Oscuro).

## HU-02: Alternar tema visual (Modo Oscuro / Claro)
**Como** usuario del sistema,
**Quiero** tener un botón para alternar entre el modo claro y oscuro en todas las pantallas,
**Para** ajustar la apariencia de la interfaz a mi nivel de confort visual y la iluminación de mi entorno.
* **Criterios de Aceptación:**
  - Los colores de fondo, paneles y texto cambian dinámicamente al presionar el botón 🌞/🌚.
  - En el visor de mapas, el mapa base se adapta automáticamente al tema escogido (Oscuro -> Esri Dark Gray, Claro -> OpenStreetMap).

## HU-03: Visualizar metadatos de un proyecto
**Como** usuario del visor de mapa,
**Quiero** ver un panel con los detalles del proyecto (modo, etapa, longitud en km y mes de avance),
**Para** conocer el contexto del inventario que estoy revisando.
* **Criterios de Aceptación:**
  - El panel lateral izquierdo muestra la información correcta obtenida de `info_proyecto.json`.
  - Si una información falta, se muestra `---`.

## HU-04: Gestionar capas de infraestructura
**Como** usuario del visor de mapa,
**Quiero** un panel de "Inventario GIS" para encender y apagar capas individuales (Túneles, Puentes, Calzadas) o usar los botones "Todo" / "Nada",
**Para** filtrar la visualización del mapa y enfocarme en los elementos que necesito analizar.
* **Criterios de Aceptación:**
  - El panel lista todas las capas con un recuento de puntos.
  - Se puede hacer toggle de cada capa mediante un checkbox.
  - Los botones "Todo" y "Nada" actúan sobre todas las capas que tienen más de 0 elementos.
  - Las capas en 0 no se pueden encender.

## HU-05: Cambiar el mapa base
**Como** analista GIS o usuario del mapa,
**Quiero** poder seleccionar entre mapas base de "Oscuro", "Satélite" y "Calles",
**Para** tener un mejor contraste con la infraestructura y apreciar el entorno del proyecto.
* **Criterios de Aceptación:**
  - Hay botones para seleccionar "Oscuro", "Satélite" y "Calles".
  - Al cambiar, se reemplaza la capa base actual (TileLayer) en el visor de Leaflet.

## HU-06: Visualizar resumen de activos en Tarjetas KPI
**Como** usuario,
**Quiero** ver Tarjetas de Métricas (KPI Cards) que muestren las cantidades de los distintos tipos de infraestructura del proyecto en el panel inferior,
**Para** comprender de forma rápida qué tipo de activos son más abundantes sin que una diferencia en magnitudes afecte la lectura.
* **Criterios de Aceptación:**
  - Las tarjetas se renderizan en el panel inferior.
  - El diseño debe adaptarse a una grilla, y de exceder una cantidad de filas razonable, el contenedor debe poder deslizarse verticalmente (scroll).
  - Las tarjetas vacías (0 pts) permanecen visibles y legibles.

## HU-07: Navegar infraestructura férrea
**Como** usuario del sistema,
**Quiero** que el listado agrupe por modo Carretero o Férreo, y que el mapa cargue geometrías propias de la industria ferroviaria si el proyecto es un corredor férreo,
**Para** revisar adecuadamente la infraestructura que no es vial (estaciones, carriles férreos, cajas culver, etc.).
* **Criterios de Aceptación:**
  - El panel principal separa los proyectos mediante los títulos correspondientes ("PROYECTOS CARRETEROS", "PROYECTOS FÉRREOS").
  - Si el proyecto es férreo, el panel de Inventario y las KPI cards mostrarán elementos como "Abscisas", "Eje Vía Férrea", etc., y descargarán sus correspondientes archivos `.fgb`.
