var app = require('express')(),
    bodyParser=require('body-parser'),
    morgan=require('morgan');

var http = require('http').Server(app);
var customer = require('./Controller/CustomerController')

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/bookBike', customer);

var port = process.env.PORT || 8088;
http.listen(port, ()=>{
    console.log('Connected at port:' + port);
})