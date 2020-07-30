const express = require('express');

const path = require('path');

const app = express();

app.set('views', path.join(__dirname, "views"));

//import routers
const settingsRouter = require('./routers/settings');

//use routers
app.use('/', settingsRouter);

module.exports = app;