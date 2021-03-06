const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function generateToken(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
}

module.exports = {
    signup: function (req, res, next) {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(422).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        // checking whether a user with a giver email exists
        User.findOne({email: email}, function (err, existingUser) {
            if (err) {
                return next(err);
            }

            // if user does exist - returning an error
            if (existingUser) {
                return res.status(422).json({
                    success: false,
                    message: 'This email is already taken'
                });
            }

            // if a user does NOT exist with a given email - create an account and return success msg
            const user = new User({
                email: email,
                password: password
            });

            user.save(function (err) {
                if (err) {
                    return next(err);
                }

                return res.json({
                    success: true,
                    message: "Successfully added",
                    data: {
                        token: generateToken(user)
                    }
                });
            });
        });
    },
    signin: function (req, res, next) {
        res.json({
            success: true,
            message: 'Successfully authenticated',
            data: {
                token: generateToken(req.user)
            }
        });
    }
};