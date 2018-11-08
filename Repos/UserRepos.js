var db = require('../db/db');
exports.login = (loginEntity) =>{
    var sql=`select * from staff where staffUsername = '${loginEntity.userName}' and staffPassword ='${loginEntity.password}';`;
    return  db.load(sql);
}