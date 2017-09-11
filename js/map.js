require([
  "esri/Map",
  "esri/Basemap",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/TileLayer",
  "esri/tasks/RouteTask",
  "esri/tasks/support/RouteParameters",
  "esri/tasks/support/FeatureSet",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/Color",
  "esri/core/urlUtils",
  "esri/widgets/ScaleBar",
  "esri/widgets/LayerList",
  "esri/widgets/Search",
  "esri/widgets/Expand",
  "esri/widgets/Compass",
  "dojo/on",
  "dojo/domReady!"
], function (
  Map, Basemap, MapView, Graphic, GraphicsLayer, FeatureLayer, TileLayer, RouteTask, RouteParameters,
  FeatureSet, SimpleMarkerSymbol, SimpleLineSymbol, Color, urlUtils, Scalebar, LayerList, Search, Expand, Compass, on
) {

  var stopSymbol = new SimpleMarkerSymbol({
    style: "cross",
    size: 15,
    outline: {
      width: 4
    }
  });

  //加载瓦片底图
  var mylayer = new TileLayer({
    url: "http://localhost:6080/arcgis/rest/services/MianYang/MapServer"
  });

  var customBasemap = new Basemap({
    baseLayers: mylayer,
    title: "MianYang Basemap",
    id: "myBasemap"
  });

  var map = new Map({
    basemap: customBasemap,
  });

  var view = new MapView({
    container: "map",
    map: map,
    zoom: 4
  });

  //添加设施点图层
  var hospital = new FeatureLayer({
    url: "http://localhost:6080/arcgis/rest/services/Facility/MapServer/0",
    title: "医疗",
    outFields: ["*"],
    displayField: "名称",
    labelsVisible: true
  });
  var fireControl = new FeatureLayer({
    url: "http://localhost:6080/arcgis/rest/services/Facility/MapServer/1",
    title: "消防",
    outFields: ["*"],
    displayField: "名称",
  });

  map.add(hospital);
  map.add(fireControl);

  //添加企业图层
  var company = new FeatureLayer({
    url: "http://localhost:6080/arcgis/rest/services/Company/MapServer/0",
    title: "企业",
    outFields: ["*"],
    displayField: "名称",
  });
  map.add(company);
  //初始化比例尺
  var scalebar = new Scalebar({
    view: view,
    style: "ruler",
    unit: "metric"
  });

  //添加比例尺
  view.ui.add(scalebar, {
    position: "bottom-right"
  });

  //添加折叠的图层控制器
  var layerList = new LayerList({
    container: document.createElement("div"),
    view: view,
    //给列表项添加功能
    listItemCreatedFunction: defineActions
  });
  layerListExpand = new Expand({
    expandIconClass: "esri-icon-layer-list", // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
    // expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
    view: view,
    content: layerList.domNode
  });
  view.ui.add(layerListExpand, "top-right");


  function defineActions(event) {
    var item = event.item;
    if (item.title == "企业")

      item.actionsSections = [
        [{
          title: "Go to full extent",
          className: "esri-icon-edit",
          id: "edit"
        }]
      ];
  }

  //添加搜索框
  var searchWidget = new Search({
    view: view,
    allPlaceholder: "查找企业或设施点",
    suggestionsEnabled: true,
    sources: [{
      featureLayer: company,
      searchFields: ["名称", "地址"],
      displayField: "名称",
      outFields: ["*"],
      name: "企业",
      placeholder: "查找企业",
      maxResults: 6,
      maxSuggestions: 6,
      suggestionsEnabled: true,
      minSuggestCharacters: 1
    }, {
      featureLayer: fireControl,
      searchFields: ["名称", "地址"],
      displayField: "名称",
      outFields: ["*"],
      name: "消防点",
      placeholder: "查找消防点",
      maxResults: 6,
      maxSuggestions: 6,
      suggestionsEnabled: true,
      minSuggestCharacters: 1
    }, {
      featureLayer: hospital,
      searchFields: ["名称", "地址"],
      displayField: "名称",
      outFields: ["*"],
      name: "医疗",
      placeholder: "查找医疗点",
      maxResults: 6,
      maxSuggestions: 6,
      suggestionsEnabled: true,
      minSuggestCharacters: 1
    }]
  });
  view.ui.add(searchWidget, {
    position: "top-left",
    index: 0
  });

  //添加指北针
  var compass = new Compass({
    view: view
  });
  view.ui.add(compass, "top-right");

  $('#ssfx-ljfx').click(function () {
    if ($('#ssfx-ljfx').text() == "实时分析") {
      RouterAnalysis();
      $('#map').css("cursor", "crosshair");
    }
  });

  //路径分析函数
  function RouterAnalysis() {
    //绑定事件
    var clickListen = on(view, "click", addStop);

    //添加路径图层
    var routeTask = new RouteTask({
      url: "http://localhost:6080/arcgis/rest/services/NetWork_MianYang/NAServer/Route"
    });
    var routeLyr = new GraphicsLayer();
    map.add(routeLyr);

    //路径参数
    var routeParams = new RouteParameters({
      stops: new FeatureSet(),
      outSpatialReference: {
        wkid: 3857
      }
    });

    //路径样式
    var routeSymbol = new SimpleLineSymbol({
      color: [24, 12, 43, 0.7],
      width: 3
    });

    function addStop(event) {
      //左键添加点
      if (event.button == 0) {
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

      //右键删除事件监听，删除图层
      if (event.button == 2) {
        clickListen.remove();
        map.layers.remove(routeLyr);
      }
    }

    //将返回值显示在地图上
    function showRoute(data) {
      var routeResult = data.routeResults[0].route;
      routeResult.symbol = routeSymbol;
      routeLyr.add(routeResult);
    }
  }
});