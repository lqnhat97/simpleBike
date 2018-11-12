var jwt = require('jsonwebtoken');
var rndToken = require('rand-token');
var moment = require('moment');
var db = require('../db/db')
const SECRET = 'NHATVINHLONG';
const AC_LIFETIME = 600; // seconds

exports.generateAccessToken = userEntity =>{
    var payload ={
        user: userEntity,
        info: 'info'
    };
    
    var token = jwt.sign(payload, SECRET, {
        expiresIn:AC_LIFETIME
    });

    return token;
}

exports.verifyAccessToken = (req,res,next)=>{
    var token = req.header['x-access-token'];
    console.log(token);

    if(token){
        jwt.verify(token,SECRET,(err, payload)=>{
            if(err){
                res.statusCode = 401;
                res.json({
                    msg: 'INVALID TOKEN',
                    error: err
                })
            } else {
                req.token_payload = payload;
                next();
            }
        })
    } else {
        res.statusCode = 403;
        res.json({
            msg: 'NO_TOKEN'
        })
    }
}

exports.generateRefreshToken = () => {
    const SIZE = 80;
    return rndToken.generate(SIZE);
}

exports.updateRefreshToken = (idStaff, staffRole, rfToken) => {
    return new Promise((resolve, reject) => {

        var sql = `delete from token where idStaff = '${idStaff}'`;
        db.insert(sql) // delete
            .then(value => {
                var rdt = moment().format('YYYY-MM-DD HH:mm:ss');
                sql = `insert into token values(${idStaff}, ${staffRole}, '${rfToken}', '${rdt}')`;
                return db.insert(sql);
            })
            .then(value => resolve(value))
            .catch(err => reject(err));
    });
}

exports.verifyAccessToken = (req, res, next) => {
    var token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, SECRET, (err, payload) => {
            if (err) {
                res.statusCode = 401;
                res.json({
                    msg: 'INVALID TOKEN',
                    error: err
                })
            } else {
                req.token_payload = payload;
                next();
            }
        });
    } else {
        res.statusCode = 403;
        res.json({
            msg: 'NO_TOKEN'
        })
    }
}