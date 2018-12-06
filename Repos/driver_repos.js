var db = require('../db/db');

exports.loadDriver = () => {
    var sql = `select * from driver;`;
    return db.load(sql);
}

exports.loadDriverById = (driver) => {
    var sql = `select * from driver where idDriver = ${driver.id};`;
    return db.load(sql);
}

exports.loadDriverLastLocationById = (driver) => {
    var sql = `select lastLocation from driver where idDriver = ${driver.id};`;
    return db.load(sql);
}

exports.updateDriverLastLocation = (driver) => {
    var sql = `update driver set lastLocation = "${driver.lastLocation}"  where idDriver = ${driver.id};`;
    return db.update(sql);
}

exports.updateDriverState = (driver) => {
    var sql = `update driver set driverState = ${driver.driverState}  where idDriver = ${driver.id};`;
    return db.update(sql);
}