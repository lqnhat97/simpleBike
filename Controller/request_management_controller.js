var express = require('express'),
    requestRepos = require('../Repos/request_management_repos'),
    authRepos = require('../Repos/AuthRepos');
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
            global.io.sockets.emit("request-driver",data[0]);
            global.io.sockets.emit("get-request");
        }).catch(err => {
            console.log(err);
        })

    }).catch(err => {
        console.log(err);
    })
})

router.post('/updateRequestState', (req, res) => {
    requestRepos.updateStateRequest(req.body).then(data)
})
module.exports = router;