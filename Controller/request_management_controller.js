var express = require('express'),
    requestRepos = require('../Repos/request_management_repos'),
    authRepos = require('../Repos/AuthRepos');
router = express.Router();

router.post('/', ( req,res) => {
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
        }else{
            res.end('There no value');
        }
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console');
    })
})

router.post('/stateById', (req, res) => {
    requestRepos.loadRequestById(req.body).then(row => {
        if (row.length > 0) {
            res.json(row);
        }else{
            res.end('There no value');
        }
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console');
    })
})

router.post('/driverLocationById', (req, res) => {
    requestRepos.loadDriverLastLocation(req.body).then(row => {
        if (row.length > 0) {
            res.json(row);
        }else{
            res.end('There no value');
        }
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console');
    })
})

module.exports = router;