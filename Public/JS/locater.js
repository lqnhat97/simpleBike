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
    var token = localStorage.getItem("key");
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkU3RhZmYiOjEsInN0YWZmTmFtZSI6IkxvbmdDSCIsInN0YWZmUGhvbmUiOiI0NTY0NTY0NTYiLCJzdGFmZlVzZXJuYW1lIjoiTG9uZ0NIIiwic3RhZmZQYXNzd29yZCI6IjQ1Njc4OSIsInN0YWZmUm9sZSI6MX0sImluZm8iOiJpbmZvIiwiaWF0IjoxNTQyNDA3NjcyLCJleHAiOjE1NDI0MDgyNzJ9.SHLcFzYfMzlYLet5B58zPHsp9rk1eSMEaYcAzfgLOcc";
    var request;
    var i = -1;
    var marker = new H.map.Marker({
        lat: 0,
        lng: 0
      });
    map.addObject(marker);
    getNoLocate()

    function getNoLocate() {
        $.ajax({
            url: 'http://localhost:8088/admin/noLocate',
            beforeSend: function (request) {
                request.setRequestHeader("x-access-token", token);
            },
            type: 'GET',
            dataType: 'json',
            timeout: 10000
        }).done(function (data) {
            var index = 0;
            request = data;
            if(data != null){
                $('empty').hide();
                data.forEach(element => {
                    index += 1;
                    $('#info_request').html($('#info_request').html() +
                        "<tr>" +
                        "<td class='col5per'>" + index + "</td>" +
                        "<td class='col20per'>" + element.clientName + "</td>" +
                        "<td class='col20per'>" + element.clientPhone + "</td>" +
                        "<td class='col30per'>" + element.clientAddress + "</td>" +
                        "<td class='col20per locateButton'><button type='button' id='" + index + "' class='locate'>Locate</button></td>" +
                        "</tr>");
                })
            }
         else $('empty').show();
        })
    }
    // Enable the event system on the map instance:
    $(document).on('click', ".locate", function () {
        i = $(this).attr('id')-1;
        map.setCenter({
            lat: request[i].startX,
            lng: request[i].startY
          });
          marker.setPosition({
            lat: request[i].startX,
            lng: request[i].startY
          });

    })
    // Add event listener:
    map.addEventListener('tap', function (evt) {
        var position = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
      //  console.log(position);
        marker.setPosition({
            lat: position.lat,
            lng: position.lng
          });
        if(i >= 0){
            request[i].startX = position.lat;
            request[i].startY = position.lng;
        }
    });
    $('#accept').click(function(){
        if(i>=0){
            var lat = request[i].startX;
            var lng = request[i].startY;
            var state = 1;
            var idRequest = request[i].idRequest;
            var datasave = {lat,lng,state,idRequest};
            datasave = JSON.stringify(datasave);
            console.log(datasave);
            $.ajax({
                url: 'http://localhost:8088/admin/located',
                beforeSend: function (request) {
                    request.setRequestHeader("x-access-token", token);
                },
                type: 'POST',
                data: datasave,
                dataType: 'json',
                contentType: 'application/json',
                timeout: 10000
            }).done(data =>{
                $('#info_request').html("");
                getNoLocate();
            })
        }
    });
})