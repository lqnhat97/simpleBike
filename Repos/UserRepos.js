var db = require('../db/db');
exports.login = (loginEntity) =>{
    if (loginEntity.role == 0){
    var sql=`select * from staff where staffUsername = '${loginEntity.userName}' and staffPassword ='${loginEntity.password}';`;
    }
    else {
    var sql=`select * from driver where driverUserName = '${loginEntity.userName}' and driverPasswords ='${loginEntity.password}';`;
    }
    return  db.load(sql);
}