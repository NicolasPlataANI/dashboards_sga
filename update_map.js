const fs = require('fs');
let content = fs.readFileSync('src/app/map-viewer.component.ts', 'utf8');

// Enable preferCanvas
content = content.replace(
  "this.map = L.map('map', { zoomControl: false, attributionControl: false, maxZoom: 22 }).setView([4.6, -74.3], 7);",
  "this.map = L.map('map', { preferCanvas: true, zoomControl: false, attributionControl: false, maxZoom: 22 }).setView([4.6, -74.3], 7);"
);

// Replace cargarGeometrias logic
const oldLogic = `          if (esCapaDePuntos && features.length > 50) {
            capa.instance = (L as any).markerClusterGroup({
              chunkedLoading: true,
              iconCreateFunction: (cluster: any) => {
                return L.divIcon({ 
                  html: \`<div style="background-color:\${capa.color}; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; color: white; text-shadow: 1px 1px 2px black; font-weight: bold; border: 2px solid rgba(255,255,255,0.8); box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-size: 11px;">\${cluster.getChildCount()}</div>\`, 
                  className: 'custom-cluster-icon',
                  iconSize: L.point(35, 35)
                });
              }
            });

            const geoJsonData = L.geoJSON(features as any, {
              pointToLayer: (f: any, latlng: any) => L.marker(latlng, {
                icon: L.divIcon({
                  html: \`<div style="background-color:\${capa.color}; border-radius: 50%; width: 22px; height: 22px; border: 2px solid rgba(255,255,255,0.8); box-shadow: 0 2px 4px rgba(0,0,0,0.4);"></div>\`,
                  className: 'custom-single-icon',
                  iconSize: L.point(22, 22)
                })
              })
            });
            
            (capa.instance as any).addLayer(geoJsonData);
          } else {
            capa.instance = L.geoJSON(features as any, {
              style: { color: capa.color, weight: 3, opacity: 0.9 },
              pointToLayer: (f: any, latlng: any) => L.marker(latlng, {
                icon: L.divIcon({
                  html: \`<div style="background-color:\${capa.color}; border-radius: 50%; width: 22px; height: 22px; border: 2px solid rgba(255,255,255,0.8); box-shadow: 0 2px 4px rgba(0,0,0,0.4);"></div>\`,
                  className: 'custom-single-icon',
                  iconSize: L.point(22, 22)
                })
              })
            });
          }`;

const newLogic = `          if (esCapaDePuntos && features.length > 50) {
            const clusterGroup = (L as any).markerClusterGroup({
              chunkedLoading: true,
              maxClusterRadius: 50,
              iconCreateFunction: (cluster: any) => {
                return L.divIcon({ 
                  html: \`<div style="background-color:\${capa.color}; border-radius: 50%; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; color: white; text-shadow: 1px 1px 2px black; font-weight: bold; border: 2px solid rgba(255,255,255,0.8); box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-size: 11px;">\${cluster.getChildCount()}</div>\`, 
                  className: 'custom-cluster-icon',
                  iconSize: L.point(35, 35)
                });
              }
            });

            // Capa invisible para alimentar al cluster (así genera las agrupaciones pero no ensucia el mapa cuando se desagrupa)
            const geoJsonInvisible = L.geoJSON(features as any, {
              pointToLayer: (f: any, latlng: any) => L.circleMarker(latlng, { radius: 0, opacity: 0, fillOpacity: 0, interactive: false })
            });
            clusterGroup.addLayer(geoJsonInvisible);

            // Capa visual de puntos en miniatura, usando Canvas para máximo rendimiento
            const geoJsonMiniaturas = L.geoJSON(features as any, {
              pointToLayer: (f: any, latlng: any) => L.circleMarker(latlng, { radius: 3.5, color: '#ffffff', weight: 1.5, fillColor: capa.color, fillOpacity: 0.9, interactive: false })
            });
            
            // Agrupamos ambas para que se prendan y apaguen juntas
            capa.instance = L.layerGroup([geoJsonMiniaturas, clusterGroup]);
          } else {
            capa.instance = L.geoJSON(features as any, {
              style: { color: capa.color, weight: 3, opacity: 0.9 },
              pointToLayer: (f: any, latlng: any) => L.circleMarker(latlng, { radius: 6, color: '#ffffff', weight: 2, fillColor: capa.color, fillOpacity: 1, interactive: false })
            });
          }`;

if (content.includes(oldLogic)) {
  content = content.replace(oldLogic, newLogic);
  fs.writeFileSync('src/app/map-viewer.component.ts', content);
  console.log('SUCCESS');
} else {
  console.log('FAILED TO MATCH');
}
