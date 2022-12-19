const express = require('express');
const {engine} = require('express-handlebars');
const session = require('express-session');

const path = require('path');

const app = express();

app.use(express.urlencoded({
    extended: true,
    parameterLimit: 10000,
    limit: '1000mb'
}));

app.use(express.json());

app.use(session({
    resave:false,
    saveUninitialized: false,
    secret: "dfg45fd5g4az4d1",
    name: "SQLite-Admin"
}));

app.engine('hbs', engine({
    layoutsDir: path.join(__dirname, "views/layouts"),
    defaultLayout: "layout",
    extname: ".hbs",
    helpers: {
        ifEquals: (a, b, options) => {
            if (a==b) {
                return options.fn(this);
            }
            else {
                return options.inverse(this);
            }
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    if (!req.session.errors) {
        req.session.errors = [];
    }

    //init db if not initalized
    next();
});

const loginRouter = require('./routers/login');

const authentication  = require('./middlewares/authentication');
const noAuthentication  = require('./middlewares/noAuthentication');

app.use('/login', noAuthentication, loginRouter);

const databasesApp = require('./apps/databases/app');
const settingsApp = require('./apps/settings/app');
const apiApp = require('./apps/api/app');

app.use('/databases', authentication, databasesApp);
app.use('/settings', authentication, settingsApp);
app.use('/api', authentication, apiApp);

app.use((req, res, next) => {
    if (req.session.authorized) {
        res.redirect('/databases');
    }
    else {
        res.redirect('/login');
    }
});


module.exports = app;
