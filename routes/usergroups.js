const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken'); 
const config = require('../config/database');

const User = require('../models/user');
const UserGroup = require('../models/usergroup');

// POST to join a user group (dual sided addition)
router.post('/join', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    role = req.body.role;
    UserGroup.getUserGroupByUserGroupCode(req.body.user_group_code, (err, userGroup) => {
        if (err) {
            res.json( { success: false, msg: 'Failed to get Usergroup.' } );
        } else {
            UserGroup.addUserToGroup(req.user, role, userGroup, (err) => {
                if (err) {
                    res.json( { success: false, msg: 'Failed to add user to UserGroup.' } );
                } else {
                    // Add usergroup to user
                    User.addUserGroupToUser(req.user, role, userGroup, (err) => {
                        if (err) {
                            res.json( { success: false, msg: 'Failed to add UserGroup to user.' } );  
                        } else {
                            res.json( { success: true, msg: req.user.username + ' added to group as ' + role +'. UserGroup added to ' + req.user.username + '\'s groups.'} );
                        }
                    })
                    
                }
            });
        }
    });
    
});

// POST to create a user group
router.post('/create', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    const newUserGroup = new UserGroup({
        name: req.body.name,
        is_private: req.body.is_private
    });
    
    // Create usergroup and add user to usergroup
    UserGroup.addUserGroup(newUserGroup, (err, userGroup) => {
        if (err) {
            res.json( { success: false, msg: 'Failed to create Usergroup.' } );
        }
        else {
            UserGroup.addUserToGroup(req.user, 'admin', userGroup, (err) => {
                if (err) {
                    res.json( { success: false, msg: 'Failed to add user to UserGroup.' } );
                } else {
                    // Add usergroup to user
                    User.addUserGroupToUser(req.user, 'admin', userGroup, (err) => {
                        if (err) {
                            res.json( { success: false, msg: 'Failed to add UserGroup to user.' } );  
                        } else {
                            res.json( { success: true, msg: 'Usergroup saved. ' + req.user.username + ' added to group as admin. UserGroup added to ' + req.user.username + '\'s groups.'} );
                        }
                    })
                    
                }
            });
        }
    });
});

// POST to get Usergroup info by groupcode
router.post('/usergroup', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    UserGroup.getUserGroupByUserGroupCode(req.body.user_group_code, (err, userGroup) => {
        if (err) {
            res.json( { success: false, msg: 'Failed to get Usergroup.' } );
        } else {
            res.json({
                success: true,
                user_group: userGroup
            });
        }
    });
});


module.exports = router;
