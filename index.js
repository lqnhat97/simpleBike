var express = require('express'),
    bodyParser = require('body-parser'),
    lowdb = require('lowdb'),
    moment = require('moment');

var app = express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .listen(PORT, () => console.log('Listening on ${ PORT }'));

var PORT = process.env.PORT || 5000