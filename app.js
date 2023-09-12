const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const {Sequelize} = require("sequelize");

const app = express();

require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.POSTGRESQL_ADDON_HOST,
    port: process.env.POSTGRESQL_ADDON_PORT,
    database: process.env.POSTGRESQL_ADDON_DB,
    username: process.env.POSTGRESQL_ADDON_USER,
    password: process.env.POSTGRESQL_ADDON_PASSWORD
})

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(error => {
    console.error('Unable to connect to the database:', error);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
