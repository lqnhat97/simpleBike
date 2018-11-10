var db = require('../db/db');

exports.loadRequest = () => {
    var sql = `select * from request`;
    db.load(sql);
}
