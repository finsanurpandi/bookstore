const express = require('express');
const app = express();
const config = require('./config');
const mongoose = require('mongoose');
const api = require('./app/routes/api');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
//const http = require('http').Server(app);


var router = express.Router();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/', api(express));
app.use(cors());

//Handle CORS request
app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Method', 'GET, POST, PUT, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \ Authorization');

	next();
});

var url = config.database;
var options = {
  useMongoClient: true,
  reconnectTries: Number.MAX_VALUE
};

mongoose.Promise = global.Promise;
mongoose.connect(url, options, (err) => {
  if (err) {
    console.log('connection error: ' + err);
  } else {
    console.log('connection success using setup from mongoose!');
  }
});


app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on port 3000");
  }
});
