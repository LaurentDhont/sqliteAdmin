const config = require('../models/config');

exports.get = (req, res) => {
    let options = {
        title: "Login",
        errors: req.session.errors
    };

    req.session.errors = [];

    res.render('login', options);
};

exports.post = async (req, res) => {
    const {password} = req.body;

    try {
        const correctPassword = await config.getPassword();
        if (correctPassword === password) {
            req.session.authorized = true;
            res.redirect('/databases');
        }
        else {
            req.session.errors.push("Failed to login.");
            res.redirect('/login');
        }
    }
    catch (e) {
        console.error(e);
        req.session.errors.push("Failed to login.");
        res.redirect('/login');
    }
};