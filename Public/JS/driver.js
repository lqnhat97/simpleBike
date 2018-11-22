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

  var ui = H.ui.UI.createDefault(map, maptypes);
  var mapEvents = new H.mapevents.MapEvents(map);
  var behavior = new H.mapevents.Behavior(mapEvents);

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
  }
  var curr;
  map.addEventListener('tap', function (evt) {
    var tap = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(loadLocation);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
    console.log(positionTap);
    getCurrLocation();
   console.log(getCurrLocation());
    console.log(curr);
    console.log(tap);
    console.log(Distance(tap,curr));
});

  

  function checkDistance(positionTap) {
    navigator.geolocation.getCurrentPosition(loadLocation)
    var d = Distance(positionTap,);
    console.log(d);
  }

  function getCurrLocation(){
    navigator.geolocation.getCurrentPosition(function(position){curr = position;});
  }

  function Distance(pTap, pCurr){
    console.log("tap" +pTap);
    console.log("curr" +pCurr);
    const toRad = x => (x * Math.PI) / 180;
    dLng = toRad(pTap.lng - pCurr.lng);
    dLat = toRad(pTap.lat - pCurr.lng);
    R = 6371; //Bán kính trái đât trong kilometers
  a = Math.sin(dLat/2) * Math.sin(dLat/2) 
        + Math.cos(toRad(pTap.lat)) * Math.cos(toRad(pCurr.coords.latitude)) 
        * Math.sin(dLng/2) * Math.sin(dLng/2);  
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000;
  };
})