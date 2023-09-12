const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const {Sequelize} = require("sequelize");

const app = express();

require('dotenv').config();

const pg = require('pg');
pg.connect(process.env.POSTGRESQL_ADDON_URI, function(err, client, done){
    if(err) console.error(err);
    else console.log('Connected to postgres! Getting schemas...');
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
