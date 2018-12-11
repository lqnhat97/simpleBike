var socket = io();
$(document).ready(() => {
    var state = {
        type: -1,
        name: ""
    };
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

    getCurrentLocation()

    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(loadCurrentLocation);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    function loadCurrentLocation(position) {
        map.setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
        });
        var marker = new H.map.Marker({
            lat: position.coords.latitude,
            lng: position.coords.longitude
        });
        map.addObject(marker);
    }

    // Enable the event system on the map instance:
    var mapEvents = new H.mapevents.MapEvents(map);
    var behavior = new H.mapevents.Behavior(mapEvents);

    // Add event listener:
    map.addEventListener('tap', function (evt) {
        // Log 'tap' and 'mouse' events:
        map.removeObjects(map.getObjects());

        var position = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
        marker = new H.map.Marker(position);
        map.addObject(marker);
        map.setCenter(position);
        //console.log(evt.type, evt.currentPointer.type);
    });

    // Create the parameters for the geocoding request:
    var geocodingParams;

    // Define a callback function to process the geocoding response:
    var onResult = function (result) {
        var locations = result.Response.View[0].Result,
            position,
            marker;
        // Add a marker for each location found
        for (i = 0; i < locations.length; i++) {
            position = {
                lat: locations[i].Location.DisplayPosition.Latitude,
                lng: locations[i].Location.DisplayPosition.Longitude
            };
            marker = new H.map.Marker(position);
            map.addObject(marker);
        }
        map.setCenter(position);
        // Create an info bubble object at a specific geographic location:
        /*var bubble = new H.ui.InfoBubble(position, {
            content: 'lat: ' + position.lat + ', lng:' + position.lng
        });

        // Add info bubble to the UI:
        ui.addBubble(bubble);*/
    };

    // Get an instance of the geocoding service:
    var geocoder = platform.getGeocodingService();

    // Call the geocode method with the geocoding parameters,
    // the callback and an error callback function (called if a
    // communication error occurs):
    /*geocoder.geocode(geocodingParams, onResult, function (e) {
        alert(e);
    });*/



    // Define a callback function to process the routing response:
    var onRoutingResult = function (result) {
        var route,
            routeShape,
            //startPoint,
            //endPoint,
            linestring;
        if (result.response.route) {
            // Pick the first route from the response:
            route = result.response.route[0];
            // Pick the route's shape:
            routeShape = route.shape;

            // Create a linestring to use as a point source for the route line
            linestring = new H.geo.LineString();

            // Push all the points in the shape into the linestring:
            routeShape.forEach(function (point) {
                var parts = point.split(',');
                linestring.pushLatLngAlt(parts[0], parts[1]);
            });

            // Retrieve the mapped positions of the requested waypoints:
            startPoint = route.waypoint[0].mappedPosition;
            endPoint = route.waypoint[1].mappedPosition;

            // Create a polyline to display the route:
            var routeLine = new H.map.Polyline(linestring, {
                style: {
                    strokeColor: 'blue',
                    lineWidth: 10
                }
            });

            // Create a marker for the start point:
            var startMarker = new H.map.Marker({
                lat: startPoint.latitude,
                lng: startPoint.longitude
            });
            var startBubble = new H.ui.InfoBubble({
                lat: startPoint.latitude,
                lng: startPoint.longitude
            }, {
                content: 'Driver Position'
            });
            // Create a marker for the end point:
            var endMarker = new H.map.Marker({
                lat: endPoint.latitude,
                lng: endPoint.longitude
            });
            var endBubble = new H.ui.InfoBubble({
                lat: endPoint.latitude,
                lng: endPoint.longitude
            }, {
                content: 'Client Positon'
            });
            // Add the route polyline and the two markers to the map:
            map.addObject(routeLine);
            map.addObject(startMarker);
            map.addObject(endMarker);
            // Add info bubble to the UI:
            ui.addBubble(startBubble);
            ui.addBubble(endBubble);
            // Set the map's viewport to make the whole route visible:
            map.setViewBounds(routeLine.getBounds());
        }
    };
    // Get an instance of the routing service:
    var router = platform.getRoutingService();

    function routing(position1, position2) {
        var routingParameters = {
            // The routing mode:
            'mode': 'fastest;car',
            // The start point of the route:
            'waypoint0': 'geo!' + position1.lat + ',' + position1.lng,
            // The end point of the route:
            'waypoint1': 'geo!' + position2.lat + ',' + position2.lng,
            // To retrieve the shape of the route we choose the route
            // representation mode 'display'
            'representation': 'display'
        };


        // Call calculateRoute() with the routing parameters,
        // the callback and an error callback function (called if a
        // communication error occurs):
        router.calculateRoute(routingParameters, onRoutingResult,
            function (error) {
                alert(error.message);
            });
    }

    //here map geocoder function
    function geo(destination) {
        destination = destination.replace(/ /g, '+') + '+Ho+Chi+Minh';
        geocodingParams = {
            searchText: destination
        }
        geocoder.geocode(geocodingParams, onResult, function (e) {
            alert(e);
        });
    }
    //END HEREMAP set up
    var token = localStorage.getItem("key");
    var assignedRequest = [];

    //get all the request
    function getAll() {
        $.ajax({
            url: '/admin',
            beforeSend: function (request) {
                request.setRequestHeader("x-access-token", token);
            },
            type: 'POST',
            dataType: 'json',
            timeout: 10000
        }).done(function (data) {
            var state_str;
            $("#user_info").html("");
        
            data.forEach(element => {
                var guideHTML = "*";
                switch (element.requestState) {
                    case 0:
                    state_str = "Not Locate";
                        break;
                    case 1:
                    state_str = "Located";
                        break;
                    case 2:
                        var combine = "" + element.idRequest + "_" + element.idDriver;

                        assignedRequest.push(element);
                        state_str = "Assigned";
                        guideHTML = "<button type='button' class='btn btn-success' id = '" + combine + "' name='guide' >Guide</button>"

                        var destination = element.clientAddress;
                        geo(destination);
                        break;
                    case 3:
                    state_str = "Moving";
                        break;
                    case 4:
                    state_str = "Finish";
                        break;
                    case 5:
                    state_str = "No bike";
                        break;
                }
                $('#user_info').html($('#user_info').html() +
                    "<tr>" +
                    "<td scope='row' class='col10per'>" + element.idRequest + "</td>" +
                    "<td class='col15per'>" + element.clientName + "</td>" +
                    "<td class='col15per'>" + element.clientPhone + "</td>" +
                    "<td class='col20per'>" + element.clientAddress + "</td>" +
                    "<td class='col10per'>" + state_str + "</td>" +
                    "<td class='col15per'>" + element.requestTime + "</td>" +
                    "<td class='col10per'>" + guideHTML + "  </td>" +
                    "</tr>");
            });
        })
    }
    getAll();

    socket.on("get-request", () => {
        if (state.type == -1) {
            setTimeout(getAll, 1000);
        } else {
            getRequestByState(state.type,state.name);
        }
    });


    //get all request by specify state
    function getRequestByState(state_param, state_text) {
        $.ajax({
            url: '/admin/state',
            type: 'POST',
            beforeSend: function (request) {
                request.setRequestHeader("x-access-token", token);
            },
            data: JSON.stringify({
                "state": state_param
            }),
            contentType: 'application/json',
            dataType: 'json',
            timeout: 10000
        }).done(function (data) {
            $("#user_info").html("");
            var guideHTML = "*";
            var index = 0;
            data.forEach(element => {
                var combine = "" + element.idRequest + "_" + element.idDriver;

                if (element.requestState == 2) {
                    guideHTML = "<button type='button' class='btn btn-success' id = '" + combine + "' name='guide' >Guide</button>"
                    var destination = element.clientAddress;
                    geo(destination);
                }
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

    //find the route by from driver to client location
    function routingById(id, position) {
        $.ajax({
            url: '/admin/requestById',
            type: 'POST',
            beforeSend: function (request) {
                request.setRequestHeader("x-access-token", token);
            },
            data: JSON.stringify({
                "id": id
            }),
            contentType: 'application/json',
            dataType: 'json',
            timeout: 10000
        }).done(function (data) {
            routing(position, {
                "lat": data[0].startX,
                "lng": data[0].startY
            });
        })
    }

    //get the driver infomation by id
    function getDriverById(idRequest, idDriver) {

        $.ajax({
            url: '/admin/driverById',
            type: 'POST',
            beforeSend: function (request) {
                request.setRequestHeader("x-access-token", token);
            },
            data: JSON.stringify({
                "id": idDriver
            }),
            contentType: 'application/json',
            dataType: 'json',
            timeout: 5000
        }).done(function (data) {
            var res = data[0].lastLocation.split(",");
            var pos = {
                "lat": res[0],
                "lng": res[1]
            }
            $('.minidriver-feild #name').val(data[0].driverName);
            $('.minidriver-feild #phone').val(data[0].driverPhone);
            $('.minidriver-feild #location').val(data[0].lastLocation);
            $('.minidriver-feild #state').val(data[0].driverState);
            routingById(idRequest, pos);
        })
    }

    $('.dropdown-item').click(function () {
        $('#dropdownMenuButton').text($(this).text());
    })
    $('#all').click(function () {
        $('#user_info').html("");
        state.type = -1;
        state.name="";
        getAll()
    });
    $('#isNotLocated').click(function () {
        $('#user_info').html("");
        state.type = 0;
        state.name="Is Not Located";
        getRequestByState(state.type, state.name);
    })
    $('#located').click(function () {
        $('#user_info').html("");
        state.type = 1;
        state.name="Located";
        getRequestByState(1, "Located");
    })
    $('#assigned').click(function () {
        $('#user_info').html("");
        state.type = 2;
        state.name="Assigned";
        getRequestByState(2, "Assigned");
    })
    $('#moving').click(function () {
        $('#user_info').html("");
        state.type = 3;
        state.name="Moving";
        getRequestByState(3, "Moving");
    })
    $('#finish').click(function () {
        $('#user_info').html("");
        state.type = 4;
        state.name="Finish";
        getRequestByState(4, "Finish");
    })
    $('#noBike').click(function () {
        $('#user_info').html("");
        state.type = 5;
        state.name="No bike";
        getRequestByState(5, "No bike");
    })


    //function set visibility of a component
    jQuery.fn.visible = function () {
        return this.css('visibility', 'visible');
    };

    jQuery.fn.invisible = function () {
        return this.css('visibility', 'hidden');
    };

    jQuery.fn.visibilityToggle = function () {
        return this.css('visibility', function (i, visibility) {
            return (visibility == 'visible') ? 'hidden' : 'visible';
        });
    };
    //

    $(document).on('click', "button[name='guide']", function () {

        if ($(this).hasClass('btn-danger')) {
            $('#guide_info').visibilityToggle();
            $(this).removeClass('btn-danger');
            $(this).addClass('btn-success');
        } else {
            $('#guide_info').visible();
            $(this).removeClass('btn-success');
            $(this).addClass('btn-danger');
            $("button[name='guide']").not(this).removeClass('btn-danger');
            $("button[name='guide']").not(this).addClass('btn-success');
        }

        map.removeObjects(map.getObjects());
        if (ui.getBubbles().length > 0) {
            ui.getBubbles().forEach(element => {
                ui.removeBubble(element);
            });
        }
        var string = $(this).attr('id').split('_');
        console.log(string)
        getDriverById(string[0], string[1]);

    })
})