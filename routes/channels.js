const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken'); 
const config = require('../config/database');

const User = require('../models/user');
const UserGroup = require('../models/usergroup');
const Channel = require('../models/channel');

// Get all a usergroup's channels
router.get('/usergroup_channels', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    UserGroup.getUserGroupByUserGroupCode(req.query.user_group_code, (err, userGroup) => {
        if (err) {
            res.json( { sucess: false, msg: 'Failed to get usergroup channels.'} );
        } else {
            const channels = userGroup.channels;
            res.json({
                success: true,
                channels: channels
            });
        }
    });
});

// Add a channel to a user group::
    // First, create the new channel object.
    // Then add the channel object's ID, name, and description to the usergroup.
router.post('/create', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    Channel.addChannel(req.body.new_channel, (err, newChannel) => {
        if (err) {
            res.json( { sucess: false, msg: 'Failed to create channel.'} );
        } else {
            UserGroup.addChannelToUserGroup(req.body.user_group_code, newChannel, (err, userGroup) => {
                if (err) {
                    res.json( { sucess: false, msg: 'Failed to get usergroup.'} );
                } else {
                    res.json({
                        success: true,
                        msg: "Channel " + newChannel.name + " successfully added to " + userGroup.name + "!"
                    });
                }
            });
        };
    });
});


module.exports = router;