const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('./cors');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));

app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use(bodyParser.json({limit: '100mb'}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors.corsHandler);
app.use('/api', indexRouter); // use '/' for digital ocean server

module.exports = app;
