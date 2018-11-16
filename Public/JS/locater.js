$(document).ready(() => {
    //HEREMAP set up
    var platform = new H.service.Platform({
        'app_id': 'sipLqTSr0Fh7wPEbdaiE',
        'app_code': 'nUrp5EdLy0MiCiywzDD1Dg'
    });

    var targetElement = document.getElementById('mapContainer');

    var maptypes = platform.createDefaultLayers();
    

    // Instantiate (and display) a map object:
    var map = new H.Map(
        document.getElementById('mapContainer'),
        maptypes.normal.map, {
            zoom: 14,
            center: {
                lng: 0,
                lat: 0
            }
        });

    //MAP UI    
    var ui = H.ui.UI.createDefault(map, maptypes);
    var mapEvents = new H.mapevents.MapEvents(map);
    var behavior = new H.mapevents.Behavior(mapEvents);


    function getNoLocate() {
        $.ajax({
            url: 'http://localhost:8088/admin/noLocate',
            beforeSend: function (request) {
                request.setRequestHeader("x-access-token", token);
            },
            type: 'POST',
            dataType: 'json',
            timeout: 10000
        }).done(function (data) {
            console.log(data);
            var guideHTML = "*";
            var index = 0;
            data.forEach(element => {
                index += 1;
                $('#user_info').html($('#user_info').html() +
                    "<tr>" +
                    "<td scope='row' class='col10per'>" + index + "</td>" +
                    "<td class='col15per'>" + element.clientName + "</td>" +
                    "<td class='col15per'>" + element.clientPhone + "</td>" +
                    "<td class='col20per'>" + element.clientAddress + "</td>" +
                    "<td class='col10per'>" + state_text + "</td>" +
                    "<td class='col15per'>" + element.requestTime + "</td>" +
                    "<td class='col10per'>" + guideHTML + " </td>" +
                    "</tr>");
            })
        })
    }
    // Enable the event system on the map instance:

    // Add event listener:
    map.addEventListener('tap', function (evt) {
        // Log 'tap' and 'mouse' events:
        map.removeObjects(map.getObjects());
        console.log(map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY));
        var position = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
        marker = new H.map.Marker(position);
        map.addObject(marker);
        map.setCenter(position);
        console.log(evt.type, evt.currentPointer.type);
    });

    // Create the parameters for the geocoding request:
    var geocodingParams = {
        searchText: '227 Nguyen Van Cu, Ho Chi Minh'
      };
    
    // Define a callback function to process the geocoding response:
    var onResult = function(result) {
      var locations = result.Response.View[0].Result,
        position,
        marker;
      // Add a marker for each location found
      for (i = 0;  i < locations.length; i++) {
      position = {
        lat: locations[i].Location.DisplayPosition.Latitude,
        lng: locations[i].Location.DisplayPosition.Longitude
      };
      marker = new H.map.Marker(position);
      map.setCenter({
        lat: locations[i].Location.DisplayPosition.Latitude,
        lng: locations[i].Location.DisplayPosition.Longitude
      })
      map.addObject(marker);
      }
    };
    
    // Get an instance of the geocoding service:
    var geocoder = platform.getGeocodingService();
    
    // Call the geocode method with the geocoding parameters,
    // the callback and an error callback function (called if a
    // communication error occurs):
    geocoder.geocode(geocodingParams, onResult, function(e) {
      alert(e);
    });

})