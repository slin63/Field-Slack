const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken'); 
const config = require('../config/database');

const User = require('../models/user');

// Register POST
router.post('/register', (req, res, next) => {
    // `let` declares a variable whose scope is limited to this block
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    })
    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json( { success: false, msg: 'Failed to register user.' } );
        }
        else {
            res.json( { success: true, msg: 'User saved.' } );
        }
    });
});

// Authenticate POST
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    // Look up the user by username
    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) { // If there is no user returned
            return res.json({success: false, msg: 'User not found'});
        }

        // If we found that username is valid, check if password is valid
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            // If the password is valid, go ahead and sign the token off.
            if (isMatch) {
                // expiresIn: in hours, equivalent to one week
                const token = jwt.sign({user: user}, config.secret, {
                    expiresIn: 604800
                });

                // Tell everyone that we succeeded, hand back the token, and return the user
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: { // Send back a new JSON of the user without the password
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            }
            else {
                return res.json({
                    success: false,
                    msg: 'Wrong password'
                });
            }
        });
    })
});

// Profile GET --> Protected by passport.authenticate('jwt', {session: false})
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

// Export the router so that other modules can use this
module.exports = router;
