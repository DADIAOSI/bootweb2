require([
  "esri/Map",
  "esri/Basemap",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/layers/TileLayer",
  "esri/tasks/RouteTask",
  "esri/tasks/support/RouteParameters",
  "esri/tasks/support/FeatureSet",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/Color",
  "esri/core/urlUtils",
  "dojo/on",
  "dojo/domReady!"
], function (
  Map, Basemap, MapView, Graphic, GraphicsLayer, TileLayer, RouteTask, RouteParameters,
  FeatureSet, SimpleMarkerSymbol, SimpleLineSymbol, Color, urlUtils, on
) {

  var routeTask = new RouteTask({
    url: "http://localhost:6080/arcgis/rest/services/NetWork_MianYang/NAServer/Route"
  });

  var routeLyr = new GraphicsLayer();

  var routeParams = new RouteParameters({
    stops: new FeatureSet(),
    outSpatialReference: {
      wkid: 3857
    }
  });

  var stopSymbol = new SimpleMarkerSymbol({
    style: "cross",
    size: 15,
    outline: {
      width: 4
    }
  });

  var mylayer = new TileLayer({
    url: "http://localhost:6080/arcgis/rest/services/MianYang/MapServer"
  });

  var customBasemap = new Basemap({    
      baseLayers: mylayer,
      title: "MianYang Basemap",    
      id: "myBasemap"    
    }); 

  var routeSymbol = new SimpleLineSymbol({
    color: [0, 0, 255, 0.5],
    width: 5
  });

  var map = new Map({
    basemap: customBasemap,
    layers: [routeLyr]
  });

  var view = new MapView({
    container: "map",
    map: map,
    zoom: 6
  });

  on(view, "click", addStop);

  function addStop(event) {
    var stop = new Graphic({
      geometry: event.mapPoint,
      symbol: stopSymbol
    });
    routeLyr.add(stop);

    routeParams.stops.features.push(stop);
    if (routeParams.stops.features.length >= 2) {
      routeTask.solve(routeParams).then(showRoute);
    }
  }

  function showRoute(data) {
    var routeResult = data.routeResults[0].route;
    routeResult.symbol = routeSymbol;
    routeLyr.add(routeResult);
  }
});