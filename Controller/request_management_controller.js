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
    requestRepos.updateRequest(req.body).then(data => {
        dataResponse={"status":200, "idRequest":req.body.idRequest};
        res.json(dataResponse);
    }).catch(err => {
        console.log(err);
    })
})
module.exports = router;