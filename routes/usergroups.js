const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken'); 
const config = require('../config/database');

const User = require('../models/user');
const UserGroup = require('../models/user-group');

// Create a user group
router.post('/create', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    const newUserGroup = new User({
        name: req.body.name,
        is_private: req.body.is_private
    })
    
    UserGroup.addUserGroup(newUserGroup, (err, usergroup) => {
        if (err) {
            res.json( { success: false, msg: 'Failed to create Usergroup.' } );
        }
        else {
            res.json( { success: true, msg: 'Usergroup saved.' } );
        }
    });
});

