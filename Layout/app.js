$(document).ready(function () {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function showPosition(position) {
        var pos = position.coords;
        var latPos = pos.latitude;
        var lngPos = pos.longitude;
        var urMarker = new H.map.Marker({
            lat: latPos,
            lng: lngPos
        })
        map.addObject(urMarker);
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    // Add marker to map
    navigator.geolocation.getCurrentPosition(showPosition, error, options);

    //init
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
        defaultLayers.normal.map, {
            pixelRatio: pixelRatio
        });
    // Interactive map
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    //Use Map
    moveMapToHoChiMinh(map);

    $("form").submit(function(e) {
        e.preventDefault();
        var fdata=$(this).serializeArray();
        console.log(fdata);
        fdata=JSON.stringify(fdata);
        console.log(fdata);
        $.ajax({
            contentType: 'application/json',
            url: 'http://localhost:8088/bookBike/',
            type: 'POST',
            data:fdata,
            dataType: 'json',
            timeout: 10000
        }).done((res)=>{
            console.log(res);
        })
    });
})