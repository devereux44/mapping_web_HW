// Create the map layer
var map = L.map("map-id", {
  center: [
    37.09, -95.71
  ],
  zoom: 4
});


var baseMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 12,
  id: "mapbox.dark",
  accessToken: API_KEY
});

// add mapbox basemap to map
baseMap.addTo(map);

// API Call
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function(data) {
  
  function markerColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "purple";
    case magnitude > 4:
      return "red";
    case magnitude > 3:
      return "orange";
    case magnitude > 2:
      return "gold";
    case magnitude > 1:
      return "yellow";
    default:
      return "green";
    }
  }


  function markerRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 5;
  }

  // Marker Style
  function markerStyle(feature) {

    quakeData = feature.properties
    console.log(quakeData) 
    
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: markerColor(quakeData.mag),
      color: "#000000",
      radius: markerRadius(quakeData.mag),
      stroke: true,
      weight: 0.5
    };
  }



  // add geojson
  L.geoJson(data, {
    pointToLayer: function(feature, marker) {
      return L.circleMarker(marker);
    },
    style: markerStyle,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Info : " + quakeData.title);
    }
  }).addTo(map);

  // Legend
  var legend = L.control({
    position: "bottomright"
  });

  // Add legend
  legend.onAdd = function() {
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "green",
      "yellow",
      "gold",
      "orange",
      "red",
      "purple"
    ];   
    var div = L.DomUtil.create("div", "info legend");
    labels = ["<strong>Scale</strong>"];


    for (var index = 0; index < grades.length; index++) {
      div.innerHTML +=
        "<i style='background: " + colors[index] + "'></i> " +
        grades[index] + (grades[index + 1] ? "&ndash;" + grades[index + 1] + "<br>" : "+");
    }
      // div.innerHTML = labels.join("<br>")
    return div;
  };

  legend.addTo(map);
});
