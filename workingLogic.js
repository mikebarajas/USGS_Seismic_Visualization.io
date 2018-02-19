// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
"T6YbdDixkOBWH_k9GbS8JQ");

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
"access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
"T6YbdDixkOBWH_k9GbS8JQ");
// Initialize the SVG layer
map._initPathRoot()
// We pick up the SVG from the map object
var svg = d3.select("#map").select("svg"),
g = svg.append("g");

d3.json("circles.json", function(collection) {
  collection.objects.forEach(function(d) {
  d.LatLng = new L.LatLng(d.circle.coordinates[0],
  d.circle.coordinates[1])
  })
})

var feature = g.selectAll("circle")
.data(collection.objects)
.enter().append("circle")
.style("stroke", "black")
.style("opacity", .6)
.style("fill", "red")
.attr("r", 20);



function createFeatures(earthquakeData) {
  
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    //Create the popups
    layer.bindPopup("<h1>" + feature.properties.place +"</h1><hr>"+"<h3>" + "Magnitude: " + feature.properties.mag+ 
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    
    //Create the circles make the radius proportionate to the magnitude of the earthquake. Also can use D3 to do this. Check in the leaflet book PDF
    // I also need to make a coloring scale based off of the magnitude
    var circle = {
      radius: 2000,
      fillColor: "#ff7800",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    L.geoJSON(feature, {
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, circle);
      }
    });
  }
      
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });
  
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

//Create gradient colors for the size of the magnitudes

//Create locations for the seismic circles

//Make a layer

function createMap(earthquakes) {
  
  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };
  
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };
  
  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });
  
  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}

