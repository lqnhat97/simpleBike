$(document).ready(function () {
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

  getLocation()

  $('#mapContainer').click(getLocation());

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

    currentMarker.setPosition({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
  }

  function sphericalDistanceBetween(position1, position2) {
    dLongitude = position2.coords.longitude - position1.coords.longitude
    dLatitude = position2.coords.latitude - position1.coords.latitude
    R = 6371 //Bán kính trái đât trong kilometers

    //Locali một số hàm toán
    sin = math.sin
    cos = math.cos
    sqrt = math.sqrt
    atan2 = math.atan2

    a = (sin(dLatitude / 2)) ^ 2 + cos(point1.y) * cos(point2.y) * (sin(dLongitude / 2)) ^ 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    d = R * c

    return d * math.pi / 180
  }
})