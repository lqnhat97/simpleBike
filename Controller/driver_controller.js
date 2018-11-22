var express = require('express'),
    driver = require('../Repos/driver_repos'),
    
router = express.Router();

router.post('/',(req,res) =>{
    driver.loadDriver().then(row => {
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
    driver.loadDriverById(req.body).then(row => {
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
    driver.loadDriverLastLocationById(req.body).then(row => {
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
    driver.updateDriverLastLocation(req.body);
})

router.post('/updateState',(req,res)=>{
    driver.updateDriverState(req.body)
})

module.exports = router;