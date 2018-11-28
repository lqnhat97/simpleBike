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
      timeout: 10000
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
  socket.on("request-driver", (data) => {
    if (driverState == 1) {
      $("#myModal").modal();
      $("#cus_name").html(data.clientName);
      $("#cus_address").html(data.clientAddress);
      $("#cus_tel").html(data.clientPhone);
      $("#cus_note").html(data.clientNote);
      driverState = 0;
    }
  })
  // Get the modal
  var modal = document.getElementById('myModal');
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "visible";
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
      timeout: 10000
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