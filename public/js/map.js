mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v12", // style URL
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 8, // starting zoom
});

const el = document.createElement('div');
el.className = 'marker';

// Create the icon element
const icon = document.createElement('i');
icon.className = 'icon fa-solid fa-house-chimney fa-bounce';

// Append the icon to the div
el.appendChild(icon);


new mapboxgl.Marker(el)
.setLngLat(listing.geometry.coordinates)
.setPopup(
  new mapboxgl.Popup({ offset: 25 }) // adds popup
    .setHTML(
        `<p>Exact location will be provided after booking</p>`
    )
)
.addTo(map);











// Create a default Marker and add it to the map.
// const marker1 = new mapboxgl.Marker({ color: "red" })
//     .setPopup(new mapboxgl
//         .Popup({ offset: 25 })
//         .setHTML(
//             `<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`
//         )
//     )
//     .setLngLat(listing.geometry.coordinates)
//     .addTo(map);