var db = require('../db/db');

exports.loadRequest = () => {
    var sql = `select * from request`;
    return db.load(sql);
}

exports.loadStateRequest = (state) => {
    var sql = `select * from request where requestState =${state.state};`;
    return db.load(sql);
}

exports.loadRequestById = (id) => {
    var sql = `select * from request where idRequest = ${id.id};`;
    return db.load(sql);
}

exports.loadDriverById = (id) => {
    var sql = `select * from driver where idDriver = ${id.id};`;
    return db.load(sql);
}

exports.updateRequest = (request) =>{
    var sql =`update request set startX = ${request.lat}, startY = ${request.lng}, requestState = ${request.state} where idRequest = ${request.idRequest};`
    return db.insert(sql);
}