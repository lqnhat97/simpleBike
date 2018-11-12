var db = require('../db/db');

exports.loadRequest = () => {
    var sql = `select * from request`;
    return db.load(sql);
}

exports.loadStateRequest = (state) => {
    var sql = `select * from request where requestState =${state.state};`;
    return db.load(sql);
}
