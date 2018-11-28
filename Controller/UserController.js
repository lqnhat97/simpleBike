var express = require('express');
var userRepos = require('../Repos/UserRepos');
var authRepos = require('../Repos/AuthRepos');
var router = express.Router();

router.post('/', (req, res) => {
    userRepos.login(req.body,res).then(rows => {
        if (rows.length > 0) {
            var userEntity = rows[0];
            var acToken = authRepos.generateAccessToken(userEntity);
            var rfToken = authRepos.generateRefreshToken();
            if(req.body.role==1){
                userEntity.idStaff = userEntity.idDriver;
                userEntity.staffRole = "driver";
            }
            authRepos.updateRefreshToken(userEntity.idStaff,userEntity.staffRole, rfToken).then(value=>{
                res.json({
                    auth: true,
                    user: userEntity,
                    access_token: acToken,
                    refresh_token: rfToken
                });
            }).catch(err=>{
                console.log(err);
						res.statusCode = 500;
						res.end('View error log on console');
            })
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

module.exports = router;