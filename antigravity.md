# Antigravity Persistent Instructions

Este archivo consolida las directrices y reglas clave de desarrollo para este proyecto. Como asistente de IA (Antigravity), debo referenciar y respetar estas normas en futuras interacciones.

## 1. Metodología de Desarrollo: TDD (Test Driven Development)
- **Regla Fundamental:** De ahora en adelante, todo el desarrollo en este proyecto se realizará siguiendo estrictamente la metodología **TDD**.
- **Proceso:** Antes de implementar cualquier nueva funcionalidad, refactorización o corrección de bugs, se deben escribir primero las pruebas unitarias (tests) que definan el comportamiento esperado. Solo una vez escritas y vistas fallar, se debe proceder a escribir el código de producción necesario para que las pruebas pasen.
- **Cobertura:** Todo el código existente y nuevo debe estar debidamente cubierto por pruebas unitarias.

## 2. Documentación del Sistema
- La documentación central del proyecto reside en la carpeta `/docs`.
- Artefactos principales a mantener actualizados:
  - `requerimientos.md`
  - `reglas_de_negocio.md`
  - `historias_de_usuario.md`
  - `casos_de_uso.md`
  - `backlog.md`
- Ante cualquier nuevo requerimiento, la documentación pertinente debe actualizarse antes o en paralelo al desarrollo.

## 3. Reglas de Negocio y UX Clave
- **Tema Visual:** La aplicación debe inicializar siempre en **Modo Oscuro** por defecto (modificado tras probar el nuevo mapa de Esri).
- **Mapa Base:** En modo claro, el mapa base por defecto es "Calles" (OpenStreetMap). En modo oscuro, es "Oscuro" (Esri Dark Gray Base, sin atribuciones visibles).
- **Consumo de Datos:** Los datos (proyectos.json, geo-capas) se consumen de manera estática desde GitHub, no hay backend tradicional.
- **Visualización de KPIs e Inventario:** Se eliminó Chart.js (Treemap) en favor de Tarjetas de Métricas (KPI Cards) diseñadas con CSS Grid, manteniendo consistencia con el diseño "Glassmorphism" e independizando el tamaño visual del valor (para favorecer capas de bajo recuento). Las tarjetas siempre deben ser visibles (sin scroll en lo posible).
- **Renderizado de Puntos y Clusters:**
  - El agrupamiento se realiza con `leaflet.markercluster` cargado de forma global en `angular.json` (para evitar bugs de minificación/ESBuild en producción).
  - Rendimiento: Se debe usar `preferCanvas: true` para renderizar puntos masivos.
  - Al alejar el mapa (zoom out), deben coexistir los agrupamientos (círculos numerados) **y** miniaturas individuales (Círculos Canvas renderizados estéticamente similares) para ilustrar la densidad de las vías de forma panorámica.
