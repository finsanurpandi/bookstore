const express = require('express');
const app = express();
const config = require('./config');
const mongoose = require('mongoose');
const api = require('./app/routes/api');
const bodyparser = require('body-parser');
const morgan = require('morgan');
//const http = require('http').Server(app);


var router = express.Router();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/', api(express));

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
