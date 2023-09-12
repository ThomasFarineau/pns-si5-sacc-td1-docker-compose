const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const {Sequelize, DataTypes} = require("sequelize");

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
    sequelize.sync().then(() => {
        console.log('Database synced');
    });
}).catch(error => {
    console.error('Unable to connect to the database:', error);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

const Visit = require('./models/visit')(sequelize, DataTypes);

function recordVisit(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const url = req.originalUrl;
    const agent = req.get('User-Agent');

    Visit.create({
        ip: ip, date: new Date(), url: url, agent: agent
    })
        .then(() => {
            next();
        })
        .catch(err => {
            console.error("Error recording visit:", err);
            next(); // Continue to the next middleware even if saving fails
        });
}

app.use(recordVisit);

app.get('/db/getVisit', (req, res) => {
    Visit.findAll()
        .then(visits => {
            res.json(visits);
        })
        .catch(err => {
            console.error("Error fetching visits:", err);
            res.status(500).send('Internal server error');
        });
});

// Route pour obtenir le nombre total de visites
app.get('/db/countVisit', (req, res) => {
    Visit.count()
        .then(count => {
            res.json({totalVisits: count});
        })
        .catch(err => {
            console.error("Error counting visits:", err);
            res.status(500).send('Internal server error');
        });
});


app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
