var express = require('express'),
    requestRepos = require('../Repos/request_management_repos'),
    authRepos = require('../Repos/AuthRepos');
    driverRepo = require('../Repos/driver_repos')
router = express.Router();

router.post('/', (req, res) => {
    requestRepos.loadRequest().then(row => {
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


router.post('/state', (req, res) => {
    requestRepos.loadStateRequest(req.body).then(row => {
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

router.post('/requestById', (req, res) => {
    requestRepos.loadRequestById(req.body).then(row => {
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

router.post('/driverById', (req, res) => {
    requestRepos.loadDriverById(req.body).then(row => {
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

router.get('/noLocate', (req, res) => {
    var data = {
        "state": 0
    };
    requestRepos.loadStateRequest(data).then(row => {
        res.json(row);
    }).catch(err => {
        console.log(err);
    })
})

router.post('/located', (req, res) => {
    requestRepos.updateRequest(req.body).then(() => {
        var dataResponse = {
            id: req.body.idRequest
        };
        requestRepos.loadRequestById(dataResponse).then(data => {
            res.sendStatus(200);
            var arrDis = [];
            driverRepo.loadDriver().then(dataDriver => {
                dataDriver.forEach(element => {
                    var splited = element.lastLocation.split(",");
                    arrDis.push(Distance({
                        lat: data[0].startX,
                        lng: data[0].startY
                    }, {
                        lat: splited[0],
                        lng: splited[1]
                    }));
                });
                arrDis=indexOfMin(arrDis);
                console.log(arrDis);
            var dataEmit={data:data[0],id:arrDis};
            console.log(dataEmit);
            global.io.sockets.emit("request-driver", dataEmit);
            });
            global.io.sockets.emit("get-request");
        }).catch(err => {
            console.log(err);
        })

    }).catch(err => {
        console.log(err);
    })
})

router.post('/updateRequestState', (req, res) => {
    requestRepos.updateStateRequest(req.body);
})

router.post('/updateRequestDriver', (req, res) => {
    requestRepos.updateRequestDriver(req.body);
})

function indexOfMin(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var min = arr[0];
    var minIndex = [];
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            min = arr[i];
        }
    }
    for (var j = 0; j < arr.length; j++) {
        if (arr[j] == min) {
            minIndex.push(j);
        }
    }
    console.log(minIndex);
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