var db = require('../db/db');
var moment = require('moment');

exports.saveInfo = (customerEntity, destination) => {
    var time = moment().format('YYYY-MM-DD HH:mm:ss');
    var unsignAddress = customerEntity.cus_des;
    var sql = `insert into request(clientName,clientPhone,clientAddress,requestState,countSearch,idDriver,startX,startY,idStaff,requestTime,clientAddressNoSign) values
    ('${customerEntity.cus_name}', '${customerEntity.cus_tel}',N'${customerEntity.cus_des}',0,0,NULL,${destination.Latitude},${destination.Longitude},1,'${time}',N'${unsignAddress}')`
    return (db.insert(sql));
}