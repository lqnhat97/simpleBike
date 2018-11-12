var express = require('express'),
    bodyParser = require('body-parser'),
    handlebars=require('handlebars'),
    morgan = require('morgan');
var cors = require('cors');
app = express();
app.use(express.static('public'));

var http = require('http').Server(app);
var customer = require('./Controller/CustomerController');
var userController = require('./Controller/UserController');
var verifyAccessToken = require('./Repos/AuthRepos').verifyAccessToken;
var requestController = require('./Controller/request_management_controller');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());


app.use('/bookBike', customer);
app.use('/api/users', userController);
app.use('/admin', verifyAccessToken, requestController);


var port = process.env.PORT || 8088;
http.listen(port, () => {
    console.log('Connected at port:' + port);
})