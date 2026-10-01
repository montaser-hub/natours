/* eslint-disable */
// Leaflet + OpenStreetMap tiles: free, no API key required (attribution shown).

export const displayMap = locations => {
  if (!window.L || !locations || !locations.length) return;

  const map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const icon = L.divIcon({
    className: 'marker',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -34]
  });

  const markers = locations.map(loc =>
    // GeoJSON stores [lng, lat]; Leaflet wants [lat, lng].
    L.marker([loc.coordinates[1], loc.coordinates[0]], {
      icon,
      title: loc.description,
      keyboard: true
    })
      .addTo(map)
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
        className: 'map-popup',
        autoClose: false,
        closeOnClick: false,
        autoPan: false
      })
  );

  map.fitBounds(L.featureGroup(markers).getBounds(), {
    paddingTopLeft: [100, 200],
    paddingBottomRight: [100, 150],
    maxZoom: 9
  });

  // Open every stop's label once the map has a viewport.
  markers.forEach(m => m.openPopup());
};
