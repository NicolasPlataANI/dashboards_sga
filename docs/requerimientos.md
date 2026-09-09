# Requerimientos del Sistema

## Requerimientos Funcionales (RF)

1. **RF-01: Listado de Proyectos**
   - El sistema debe mostrar un listado de proyectos obtenidos de una fuente de datos externa (`proyectos.json`), agrupados por su respectivo "mes de avance" o fecha.
2. **RF-02: Acceso a Visor de Proyectos**
   - El sistema debe permitir a los usuarios seleccionar un proyecto del listado para acceder a una vista detallada (visor geográfico) de dicho proyecto.
3. **RF-03: Visualizador de Mapa Interactivo**
   - El sistema debe integrar un mapa interactivo (usando Leaflet) que permita cargar, decodificar y renderizar datos geoespaciales en formato binario FlatGeobuf (`.fgb`).
4. **RF-04: Gestión de Capas Base**
   - El mapa debe permitir alternar entre al menos tres mapas base: "Oscuro" (Esri Dark Gray Base), "Satélite" (ArcGIS), y "Calles" (OpenStreetMap).
5. **RF-05: Gestión de Inventario GIS (Capas Físicas)**
   - El sistema debe listar las capas de infraestructura del proyecto (ej. Calzadas, Puentes, Túneles, Peajes).
   - El sistema debe permitir al usuario encender (mostrar) y apagar (ocultar) estas capas de manera individual o masiva ("Todo" o "Nada").
6. **RF-06: Representación de Estadísticas (Tarjetas KPI)**
   - El sistema debe mostrar Tarjetas de Métricas (KPI Cards) que indiquen la cantidad de elementos detectados para cada capa física del inventario GIS, ordenados de mayor a menor cantidad. El contenedor de estas tarjetas debe adaptarse de forma dinámica para prevenir roturas en el layout si existen muchas capas.
7. **RF-07: Información del Proyecto**
   - El visor de mapa debe mostrar en un panel lateral información clave del proyecto: Nombre, Modo, Etapa, Longitud y Mes de Avance.
8. **RF-08: Modos de Visualización (Temas)**
   - El sistema debe incluir un selector para alternar la interfaz entre un tema visual Claro y un tema Oscuro, adaptando los colores de los paneles y los mapas por defecto (el sistema iniciará en Modo Oscuro).
9. **RF-09: Búsqueda de Proyectos**
   - El sistema debe proveer una barra de búsqueda de texto libre que filtre reactivamente el listado de proyectos por su nombre.
10. **RF-10: Internacionalización (i18n)**
    - El sistema debe estar preparado para soportar múltiples idiomas (al menos Español e Inglés), permitiendo al usuario cambiar el idioma de la interfaz dinámicamente.
11. **RF-11: Múltiples Modos de Transporte (Carretero y Férreo)**
    - El sistema debe categorizar dinámicamente los proyectos bajo diferentes modos de infraestructura (ej. "Carretero", "Férreo") en el menú de listado, y cargar las capas geográficas correspondientes a dicho modo en el visor (ej. capas convencionales para Carreteros, y capas Mf* para Férreos).

## Requerimientos No Funcionales (RNF)

1. **RNF-01: Rendimiento en Carga de Datos**
   - El sistema debe cargar y decodificar los archivos de geometrías (FlatGeobuf) en paralelo empleando flujos (streams) para optimizar la velocidad y el rendimiento en el navegador.
2. **RNF-02: Arquitectura y Tecnologías**
   - La aplicación debe ser desarrollada como una Single Page Application (SPA) utilizando Angular 21 (o superior) en modo Standalone Components.
3. **RNF-03: Diseño Interfaz**
   - La interfaz debe estar construida con Tailwind CSS, garantizando una correcta adaptabilidad y estilado en componentes, incluyendo paletas de colores asociadas a temas claro/oscuro.
4. **RNF-04: Dependencias Principales**
   - El mapa debe implementarse con `leaflet`.
   - La lectura de datos geográficos vectoriales utilizará `flatgeobuf`.
