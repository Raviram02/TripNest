mapboxgl.accessToken = mapToken;

// Initialize map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates, // [lng, lat]
    zoom: 12
});

// Add a single draggable marker at current coordinates
const marker = new mapboxgl.Marker({ color: 'red', draggable: false })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h4>${listing.location}</h4><h6>Visit here to rent the vehicle!</h6>`
        )
    )
    .addTo(map);

// Update hidden inputs initially
const latInput = document.getElementById('lat');
const lngInput = document.getElementById('lng');
if (latInput && lngInput) {
    lngInput.value = listing.geometry.coordinates[0];
    latInput.value = listing.geometry.coordinates[1];
}

// 🔒 Removed: No map click handler to prevent marker from moving
