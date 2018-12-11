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
        res.json(row).end(200);
    }).catch(err => {
        console.log(err);
    })
})

router.post('/located', (req, res) => {
    requestRepos.updateRequest(req.body).then(() => {
        var dataResponse = {
            id: req.body.idRequest
        };
        sendRequestToDriver(dataResponse);
        setInterval(() => {
            sendRequestToDriver(dataResponse);
        }, 10000);
        res.sendStatus(200);
    }).catch(err => {
        console.log(err);
    })
})

router.post('/updateRequestState', (req, res) => {
    requestRepos.updateStateRequest(req.body).then(() => {
        global.io.sockets.emit("get-request");
        res.status(200).end();
    });
})

router.post('/updateRequestDriver', (req, res) => {
    var tmp = {
        id: req.body.idRequest
    };
    requestRepos.loadRequestById(tmp).then(data => {
        console.log(data[0])
        if (data[0].idDriver == null) {
            requestRepos.updateRequestDriver(req.body).then(() => {
                global.io.sockets.emit("get-request");
                res.json(status = {
                    code:200
                }).end();
            });
        } else {
            res.json(status = {
                code:500
            }).end();
        }
    });
})

function indexOfMin(arr) {
    if (arr.length === 0) {
        return -1;
    }
    var min = arr[0];
    var minIndex = [];
    for (var i = 1; i < arr.length; i++) {
        if (min == 0) {
            if (arr[i] > 0) {
                min = arr[i];
            }
        } else {
            if (arr[i] < min && arr[i] > 0) {
                min = arr[i];
            }
        }
    }
    if (min == 0)
        return -1;
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

function sendRequestToDriver(id) {
    requestRepos.loadRequestById(id).then(data => {
        if (data[0].requestState == 1 && data[0].countSearch != 3) {
            requestRepos.updateCountSearch(id.id).then(() => {
                var arrDis = [];
                driverRepo.loadDriver().then(dataDriver => {
                    dataDriver.forEach(element => {
                        if (element.driverState == 1) {
                            var splited = element.lastLocation.split(",");
                            var kc = 10000 - Distance({
                                lat: data[0].startX,
                                lng: data[0].startY
                            }, {
                                lat: splited[0],
                                lng: splited[1]
                            })
                            if (kc >= 0) {
                                arrDis.push(kc);
                            } else {
                                arrDis.push(0);
                            }

                        } else {
                            arrDis.push(0)
                        }
                    });
                    arrDis = indexOfMin(arrDis);
                    var dataEmit = {
                        data: data[0],
                        id: arrDis
                    };
                    global.io.sockets.emit("request-driver", dataEmit);;

                });
                global.io.sockets.emit("get-request");
            });
        }
        if (data[0].countSearch == 3) {
            requestRepos.updateStateRequest({state:5,idRequest:id.id});
            global.io.sockets.emit("get-request");
            clearInterval(this)
        }
    }).catch(err => {
        console.log(err);
    })

}

module.exports = router;