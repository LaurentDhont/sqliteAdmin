module.exports = (req, res, next) => {
    if (req.session.authorized) {
        res.redirect('/databases');
    }
    else {
        next();
    }
};
