# Plan de Despliegue: Soporte para Proyectos Férreos

Este plan describe los pasos necesarios para habilitar la visualización y segregación de los proyectos férreos (como el proyecto de muestra `CBB`) en el dashboard y visor geográfico.

## 1. Actualización de Datos (Repositorio `ani-datos-gis`)

1.  **Subida de Archivos del Proyecto:** Subir la carpeta `CBB` (que contiene los archivos `Mf*.fgb` y su `info_proyecto.json`) al repositorio en GitHub de donde se leen los datos estáticos.
2.  **Actualización del Catálogo (`proyectos.json`):**
    *   Agregar el nuevo proyecto `CBB` al archivo `proyectos.json`.
    *   Asegurar que incluya la propiedad `"modo": "Férreo"`.
    *   Verificar que los proyectos carreteros actuales tengan explícitamente `"modo": "Carretero"` (o establecer este valor como fallback por defecto si no existe).

## 2. Refactorización del Componente de Lista (`project-list.component.ts`)

Actualmente, los proyectos se agrupan únicamente por mes (y año). Se requiere una subagrupación por "modo" de transporte.

**Pasos (siguiendo TDD):**
1.  **Actualizar Pruebas:** Modificar `project-list.component.spec.ts` para definir el comportamiento esperado de la nueva estructura. La prueba debe verificar que los datos se agrupan primero por `mes` y, dentro de cada mes, por `modo`.
2.  **Modificar la Lógica:** Actualizar el método `agruparPorMes` para que el tipo de retorno soporte modos:
    ```typescript
    // Estructura sugerida
    [{
      mes: 'Septiembre 2026',
      modos: [
        { nombre: 'Férreo', proyectos: [...] },
        { nombre: 'Carretero', proyectos: [...] }
      ]
    }]
    ```
3.  **Modificar la Plantilla (HTML):** Actualizar el bucle `@for` anidado en el HTML del componente para iterar sobre los modos dentro de cada mes y agregar un subtítulo (por ejemplo, "FÉRREOS" y "CARRETEROS") antes de iterar sobre las tarjetas de proyectos.

## 3. Adaptación del Visor Geográfico (`map-viewer.component.ts`)

El visor actual (`map-viewer.component.ts`) tiene una lista quemada (hardcoded) de capas correspondientes a proyectos carreteros (`calzada.fgb`, `puente.fgb`, `tunel.fgb`, etc.). Como los proyectos férreos tienen capas diferentes (`MfCarril.fgb`, `MfEjeViaFerrea.fgb`, etc.), el visor debe ser dinámico.

**Pasos:**
1.  **Definir Listas de Capas por Modo:** Crear diccionarios o dos arreglos distintos de definición de capas en el componente:
    *   `capasCarretero`: La lista actual.
    *   `capasFerreo`: La nueva lista correspondiente a los archivos encontrados en `/CBB` (ej. `MfCarril.fgb`, `MfSenal.fgb`, `MfPasoNivel.fgb`, etc.) asignándoles colores acordes.
2.  **Carga Dinámica Basada en Modo:**
    *   El método `ngOnInit` lee el `info_proyecto.json` y obtiene el `modo` del proyecto.
    *   Modificar la lógica para que, una vez identificado el modo, se asigne la lista de capas correspondiente a la variable `capasFisicas` (o se decida cuál renderizar) antes de llamar a `cargarGeometrias()`.

## 4. Ejecución y Validación

1.  Ejecutar la suite de pruebas unitarias (`ng test`) y verificar que todas pasen.
2.  Servir la aplicación localmente (`ng serve`) y comprobar que el proyecto `CBB` se agrupa en su mes respectivo bajo el subtítulo de modo Férreo.
3.  Acceder al visor del proyecto `CBB` y asegurar que los KPIs y geometrías (líneas y puntos) de las capas tipo `Mf*.fgb` se rendericen de manera óptima y estética.


## Estado Actual

Este plan ha sido **IMPLEMENTADO Y COMPLETADO** de manera exitosa en el repositorio, incluyendo el despliegue del componente adaptativo de KPI cards para soportar el abundante número de capas férreas sin romper el diseño.
