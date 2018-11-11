var express = require('express'),
    requestRepos = require('../Repos/request_management_repos'),
    authRepos=require('../Repos/AuthRepos');
    router=express.Router();
    
router.post('/',(req,res) =>{
    requestRepos.loadRequest.then(row =>{
        if(row.length >0){
            res.json(row);
        }
    }).catch(err =>{
        console.log(err);
        res.statusCode = 500;
        res.end('View error log on console');
    })
})

module.exports = router;