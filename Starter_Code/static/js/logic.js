Fetch data from the data.json file
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(data => {
    // Initialize the map
    const map = L.map('map').setView([40, -100], 4);  // Changed view to focus on the US
  
    // Add the base layer with a lighter style
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);
  
    // Function to determine marker size based on magnitude
    function getSize(magnitude) {
      return magnitude * 5;  // Increased size multiplier
    }
  
    // Function to determine marker color based on depth
    function getColor(depth) {
      return depth > 90 ? '#ff0000' :
             depth > 70 ? '#ff6600' :
             depth > 50 ? '#ffa500' :
             depth > 30 ? '#ffff00' :
             depth > 10 ? '#adff2f' :
                          '#00ff00';
    }
  
    // Iterate through each earthquake feature
    data.features.forEach(feature => {
      const coordinates = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;
      const depth = coordinates[2];
      const place = feature.properties.place;
  
      // Create a circle marker
      const marker = L.circleMarker([coordinates[1], coordinates[0]], {
        radius: getSize(magnitude),
        fillColor: getColor(depth),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
  
      marker.bindPopup(`
        <strong>Magnitude:</strong> ${magnitude}<br>
        <strong>Depth:</strong> ${depth}<br>
        <strong>Location:</strong> ${place}
        `)
  
      marker.addTo(map);
    });
  
    const legend = L.control({position:'bottomright'});

    legend.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = [-10,10,30,50,70,90];
        const label = []

        for ( let i=0; i< grades.length ; i++) {
            div.innerHTML += 
                '<i style="background: ' + getColor(grades[i]+1) + '"></i> ' + 
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }   
        return div;
    }

   legend.addTo(map);
    
  });