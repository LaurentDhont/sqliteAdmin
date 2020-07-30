const express = require('express');

const path = require('path');

const app = express();

app.set('views', path.join(__dirname, "views"));

//import routers
const databasesRouter = require('./routers/databases');

//use routers
app.use('/', databasesRouter);

module.exports = app;