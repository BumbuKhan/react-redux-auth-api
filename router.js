const Authentication = require('./comntrollers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});

module.exports = function (app) {
    app.get('/', requireAuth, function (req, res, next) {
        res.send('Hi there!');
    });

    app.post('/signup', Authentication.signup);
};