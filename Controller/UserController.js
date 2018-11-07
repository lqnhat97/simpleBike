var express = require('express');
var userRepos = require('../Repos/UserRepos');
var authRepos = require('../Repos/AuthRepos');
var router = express.Router();

router.post('/', (req, res) => {
    //var userName=req.body.username;
    //var password=req.body.password;
    var loginEntity = {
        userName: 'lqnhat',
        password: 'nhat1234'
    }
    // userRepos.login(loginEntity).then(row => {
    //     if (row.lenght > 0) {
            var userEntity = loginEntity;
            var acToken = authRepos.generateAccessToken(userEntity);
            var rfToken = authRepos.generateRefreshToken();
            res.json({
                auth: true,
                user: userEntity,
                access_token: acToken,
                refresh_token: rfToken
            })
    //     } else {
    //         res.json({
    //             auth: false
    //         })
    //     }
    // }).catch(err => {
    //     console.log(err);
    //     res.statusCode = 500;
    //     res.end('View error log on console');
    // })

})

module.exports = router;