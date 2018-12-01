var express = require('express'),
    driverRepo = require('../Repos/driver_repos'),
    requestRepo = require('../Repos/request_management_repos')
router = express.Router();

router.post('/',(req,res) =>{
    driverRepo.loadDriver().then(row => {
        if (row.length > 0) {
            res.json(row);
        } else {
            res.json({
                auth: false
            })
        }
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console');
    })
})

router.post('/byId',(req,res)=>{
    driverRepo.loadDriverById(req.body).then(row => {
        if (row.length > 0) {
            res.json(row);
        } else {
            res.end('There no value');
        }
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console');
    })
})

router.post('/getLastLocation',(req,res)=>{
    driverRepo.loadDriverLastLocationById(req.body).then(row => {
        if (row.length > 0) {
            res.json(row);
        } else {
            res.end('There no value');
        }
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console');
    })
})

router.post('/updateLastLocation',(req,res)=>{
    driverRepo.updateDriverLastLocation(req.body);
})

router.post('/updateState',(req,res)=>{
    driverRepo.updateDriverState(req.body)
})

router.get('/getNearestDriver',(req,res)=>{
    var request=requestRepo.loadRequestById(req.body.requestId);
    var allDriver = driverRepo.loadDriver();
    var arrDis =[];
    allDriver.forEach(element => {
        var splited=element.lastLocation.split(",");
        arrDis.push(Distance({lat:request.startX,
        lng:request.startY},
        {lat: splited[0],
        lng:splited[1]}));
    });
    var nearestDriver = allDriver[indexOfMin(arrDis)];
    res.json(nearestDriver)
})

function indexOfMin(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var min = arr[0];
    var minIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }

    return minIndex;
}

function Distance(position1, position2) {
    const toRad = x => (x * Math.PI) / 180;
    dLng = toRad(position1.lng - position2.lng);
    dLat = toRad(position1.lat - position2.lat);
    R = 6371; //Bán kính trái đât trong kilometers
    a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(position1.lat)) * Math.cos(toRad(position2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
  };

module.exports = router;