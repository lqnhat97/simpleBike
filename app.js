$(document).ready(function () {
    var platform = new H.service.Platform({
        app_id: 'gDzN0nMCji5lof7dXffC',
        app_code: 'LTEbJMPNijbdRxULdUrFmg',
        useHTTPS: true
    });

    //Set map at HCMC
    function moveMapToHoChiMinh(map) {
        map.setCenter({
            lat: 10.762622,
            lng: 106.660172
        });
        map.setZoom(13);
        map.setBaseLayer(defaultLayers.normal.traffic);
        map.addLayer(defaultLayers.incidents);
    }

    // Obtain the default map types from the platform object
    var pixelRatio = window.devicePixelRatio || 1;
    var defaultLayers = platform.createDefaultLayers({
        tileSize: pixelRatio === 1 ? 256 : 512,
        ppi: pixelRatio === 1 ? undefined : 320
    });

    // Instantiate (and display) a map object:
    var map = new H.Map(
        document.getElementById('mapContainer'),
        defaultLayers.normal.map, {pixelRatio: pixelRatio});
    // Interactive map
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    //Use Map
    moveMapToHoChiMinh(map)

})