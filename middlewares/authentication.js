module.exports = (req, res, next) => {
    if (req.session.authorized) {
        next();
    }
    else {
        res.redirect('/login');
    }
};