const express = require('express');

const path = require('path');

const app = express();


//import routers
const databasesRouter = require('./routers/databases');

//use routers
app.use('/v1/databases', databasesRouter);

module.exports = app;
