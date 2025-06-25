mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: 'map', // must match the ID in edit.ejs
  style: 'mapbox://styles/mapbox/streets-v12',
  center: listing.geometry.coordinates, // [lng, lat]
  zoom: 12,
});

map.addControl(new mapboxgl.NavigationControl());

let currentMarker = new mapboxgl.Marker({ color: 'red' })
  .setLngLat(listing.geometry.coordinates)
  .addTo(map);

let userMarker = null;

map.on('click', (e) => {
  const { lng, lat } = e.lngLat;

  if (userMarker) userMarker.remove();

  userMarker = new mapboxgl.Marker({ color: 'blue' })
    .setLngLat([lng, lat])
    .addTo(map);

  // update form inputs
  const latInput = document.getElementById('lat');
  const lngInput = document.getElementById('lng');

  if (latInput && lngInput) {
    latInput.value = lat;
    lngInput.value = lng;
  }
});
