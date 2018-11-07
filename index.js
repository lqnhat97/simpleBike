var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan');
app = express();
app.use(express.static('public'));

var http = require('http').Server(app);
var customer = require('./Controller/CustomerController');
var userController = require('./Controller/UserController');
var verifyAccessToken = require('./Repos/AuthRepos').verifyAccessToken;
var requestController = require('./Controller/request_management_controller');

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/bookBike', customer);
app.use('/api/users', userController);
app.use('/admin',requestController);
var port = process.env.PORT || 8088;
http.listen(port, () => {
    console.log('Connected at port:' + port);
})