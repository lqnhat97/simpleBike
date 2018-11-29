var socket = io();
$(document).ready(function () {
  $('#status').bootstrapToggle({
    onstyle: 'danger',
    offstyle: 'light'
  });

  var platform = new H.service.Platform({
    'app_id': 'sipLqTSr0Fh7wPEbdaiE',
    'app_code': 'nUrp5EdLy0MiCiywzDD1Dg'
  });

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

  var currentMarker = new H.map.Marker({
    lat: 0,
    lng: 0
  });

  map.addObject(currentMarker);

  var ui = H.ui.UI.createDefault(map, maptypes);
  var mapEvents = new H.mapevents.MapEvents(map);
  var behavior = new H.mapevents.Behavior(mapEvents);
  var curr;

  getLocation();

  function getLocation() {
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
    curr = position;
  }

  function changeDriverLastLocation(location) {
    var idDriver = localStorage.getItem("idDriver");
    var lastLocation = "" + location.coords.latitude + "," + location.coords.longitude;
    console.log(lastLocation);
    $.ajax({
      url: 'http://localhost:8088/driver/updateState',
      beforeSend: function (request) {
        request.setRequestHeader("x-access-token", token);
      },
      data: JSON.stringify({
        "id": idDriver,
        "lastLocation": lastLocation
      }),
      type: 'POST',
      dataType: 'json',
      timeout: 1000
    })
  }

  var idDriver = localStorage.getItem("idDriver");
  var driverState = 0;
  $("#status").change(() => {

    if ($("#status").prop("checked"))
      driverState = 1;
    else driverState = 0;
    changeDriverStatus(driverState);
  })

  var requestLocation;
  socket.on("request-driver", (data) => {
    if (driverState == 1) {
      driverState = 0;
      changeDriverStatus(driverState);
      $("#status").bootstrapToggle('off');
      $("#myModal").modal({
        backdrop: 'static',
        keyboard: false
      });
      $("#cus_name").html(data.clientName);
      $("#cus_address").html(data.clientAddress);
      $("#cus_tel").html(data.clientPhone);
      $("#cus_note").html(data.clientNote);
      requestLocation = {lat: data.startX, lng:data.startY};
    }
  })

  $("#accept").click(function () {
    driverState = 0;
    changeDriverStatus(driverState);
    $("#status").bootstrapToggle('off');
    //Socket something back
    routing(requestLocation, {
      lat: curr.coords.latitude,
      lng: curr.coords.longitude
    });
  })


  //Routing
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

    console.log(routingParameters);

    // Call calculateRoute() with the routing parameters,
    // the callback and an error callback function (called if a
    // communication error occurs):
    router.calculateRoute(routingParameters, onRoutingResult,
      function (error) {
        alert(error.message);
      });
  }

  $("#deny").click(function () {
    driverState = 1;
    changeDriverStatus(driverState);
    $("#status").bootstrapToggle('on');
  })



  // Get the modal
  var modal = document.getElementById('myModal');
  window.onclick = function (event) {
    if (event.target !== modal) {
      return;
    }
  }
  var token = localStorage.getItem("key");

  function changeDriverStatus(driverState) {
    var fdata = JSON.stringify({
      "id": idDriver,
      "driverState": driverState
    });
    $.ajax({
      contentType: 'application/json',
      url: '/driver/updateState',
      beforeSend: function (request) {
        request.setRequestHeader("x-access-token", token);
      },
      data: fdata,
      type: 'POST',
      dataType: 'json',
      timeout: 1000
    })
  }


  map.addEventListener('tap', function (evt) {

    getCurrLocation();
    var tap = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);

    distance = Distance(tap, curr);

    if (distance > 100) {

      alert("Your location is wrong!");

    } else {
      result = confirm("Update your location?");
      if (result) {
        console.log("save");
        changeDriverLastLocation(curr);
      }
    }

  });

  function getCurrLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
      curr = position;
    });
  }



  function Distance(pTap, pCurr) {
    console.log(pTap);
    console.log(pCurr);
    const toRad = x => (x * Math.PI) / 180;
    dLng = toRad(pTap.lng - pCurr.coords.longitude);
    dLat = toRad(pTap.lat - pCurr.coords.latitude);
    R = 6371; //Bán kính trái đât trong kilometers
    a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(pTap.lat)) * Math.cos(toRad(pCurr.coords.latitude)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
  };
})