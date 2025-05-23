mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 12 // starting zoom
});

const marker1 = new mapboxgl.Marker({ color: 'red'})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(
            `<br><h4>${listing.title}</h4><h6>You'll be here!</h6>`
        ))
        .addTo(map);

