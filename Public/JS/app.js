$(document).ready(function () {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };


    function showPosition(position) {
        console.log(position);
        var pos = position.coords;
        //init
        var platform = new H.service.Platform({
            app_id: 'gDzN0nMCji5lof7dXffC',
            app_code: 'LTEbJMPNijbdRxULdUrFmg',
            useHTTPS: true
        });

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

        map.setCenter({
            lat: pos.latitude,
            lng: pos.longitude
        });
        map.setZoom(15);
        map.setBaseLayer(defaultLayers.normal.traffic);
        map.addLayer(defaultLayers.incidents);
        var urMarker = new H.map.Marker({
            lat: pos.latitude,
            lng: pos.longitude
        })
        map.addObject(urMarker);
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    // Add marker to map
    navigator.geolocation.getCurrentPosition(showPosition, error, options);

    $("form").submit(function (e) {
        e.preventDefault();
        var fdata = $(this).serializeArray();
        console.log(fdata);
        fdata = JSON.stringify(fdata);
        console.log(fdata);
        $.ajax({
            contentType: 'application/json',
            url: 'http://localhost:8088/bookBike/',
            type: 'POST',
            data: fdata,
            dataType: 'json',
            timeout: 10000
        }).done((res) => {
            console.log(res);
        })
    });
})