var map = L.map('map').setView([41.8369, -87.6847], 11);

map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.boxZoom.disable();
map.keyboard.disable();

map.on("click", placePoints);

var Esri_OceanBasemap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
	maxZoom: 13}).addTo(map);

var mapp = d3.select(map.getPanes().overlayPane).append("svg"),
    g = mapp.append("g").attr("class", "leaflet-zoom-hide");


function placePoints() {
d3.json("chicagohomicides2013.geojson", function(collection) {
  var transform = d3.geo.transform({point: projectPoint}),
      path = d3.geo.path().projection(transform);
  var feature = g.selectAll("path")
      .data(collection.features)
      //Place the points with a delay
      .enter().append("path").transition().delay(function(d, i) { return 100 * i} );
  mapp.on("viewreset", reset);
  reset();

  // Reposition the SVG to cover the features.
  function reset() {
    var bounds = path.bounds(collection),
        topLeft = bounds[0],
        bottomRight = bounds[1];
    mapp.attr("width", bottomRight[0] - topLeft[0])
        .attr("height", bottomRight[1] - topLeft[1])
        .style("left", topLeft[0] + "px")
        .style("top", topLeft[1] + "px");
    g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
    feature.attr("d", path);
  }

 // Use Leaflet to implement a D3 geometric transformation.
  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }
});
}


//parse date and position by month
d3.csv("monthlyhomicides.csv", function(error,data){
	makeChart(data);
} )

var barChart = d3.select("#bar")
            .append("svg")
            .attr("width", "100%")
            .attr("height", 700);

function makeChart(data){
	var bP = barChart.selectAll("g.bP")
   .data(data)
   .enter()
   .append("g");

   var appendRect1 = bP
   .append("rect")
   .attr("y", function(d, i) {
    return (i * (704 / 12) + 2);
   })
   .attr("x", 0)
   .attr("height", 53)
   .attr("width", function(d) {
      return 8*d.Count;
    })
    .attr("fill", function(d) {
    return "rgb(" + (d.Count * 5) + ",0,60)";
    });

   barChart.selectAll("text")
   .data(data)
   .enter()
   .append("text")
   .text(function(d) {
        return d.Month + ": " + d.Count;
   })
   .attr("y", function(d, i) {
        return i * (704/12) +35;
   })
   .attr("x", 10)
   .attr("fill","white");
}
