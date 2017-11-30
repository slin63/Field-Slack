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

// Get all channels given a userGroupCode
router.get('/usergroup', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    const channelIDs = req.query.user_group_code;
    Channel.getChannels(channelIDs)
    .then((channels, err) => {
        if (err) {
            return res.json({ success: false, msg: "Couldn't get channels." });
        } else {
            return res.json({ 
                success: true,
                channels: channels,
                msg: "Successfully got channels!"
            })
        }
    })
})

// Add a channel to a user group::
    // First, create the new channel object.
    // Then add the channel object's ID, name, and description to the usergroup.
router.post('/', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    const newChannel = new Channel({
        name: req.body.name,
        description: req.body.description,
        messages: req.body.messages,
        user_group_code: req.body.user_group_code
    });
    Channel.addChannel(newChannel, (err, newChannel) => {
        if (err) {
            res.json( { success: false, msg: 'Failed to create channel.'} );
        } else {
            UserGroup.addChannelToUserGroup(req.body.user_group_code, newChannel, (err, userGroup) => {
                if (err) {
                    res.json( { sucess: false, msg: 'Failed to get usergroup.'} );
                } else {
                    res.json({
                        success: true,
                        channel: newChannel,
                        user_group: userGroup,
                        msg: "Channel " + newChannel.name + " successfully added to " + userGroup.name + "!"
                    });
                }
            });
        };
    });
});

// Delete a channel given some ID and also remove the channel refernce from its parent usergroup
router.delete('/', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    Channel.deleteChannel(req.query.channel_id)
    .then((err, doc) => {
        return UserGroup.removeChannelFromUserGroup(req.query.user_group_code, req.query.channel_id);
    })
    .then((userGroup, err) => {
        if (err) {
            throw err;
        } else {
            res.json({
                success: true,
                user_group: userGroup,
                msg: "Channel successfully deleted."
            });
        }
    })
    .catch((err) => {
        throw err;
    });
});

router.put('/', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    Channel.editChannel(req.body.channel_id, req.body.channel_edits)
    .then((channel, err) => {
        if (err) {
            throw err;
        } else {
            res.json({
                success: true,
                channel: channel,
                msg: "Channel successfully updated."
            })
        }
    })
    .catch((err) => {
        throw err;
    })
});

// Add a message to a channel
router.post('/messages', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    Channel.addMessage(req.body.channel_id, req.body.new_message)
    .then((channel, err) => {
        if (err) {
            throw err;
        } else {
            res.json({
                success: true,
                channel: channel,
                msg: "Message added to channel archive."
            });
        }
    })
    .catch((err) => {
        throw err;
    });
});

// Get all a channel's messages
router.get('/messages', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    Channel.getChannelByID(req.query.channel_id)
    .then((channel, err) => {
        if (err) {
            throw err;
        } else {
            res.json({
                success: true,
                channel: channel,
                messages: channel.messages,
                msg: "Successfully retrieved channels and messages."
            });       
        }
    })
    .catch((err) => {
        throw err;
    });
});

// Search and return a channel's messages by string
router.get('/messages', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    Channel.findMessagesByString(req.query.channel_id, req.query.string)
    .then((messages, err) => {
        if (err) {
            throw err;
        } else {
            res.json({
                success: true,
                messages: messages,
                msg: "Found messages with string in them."
            })
        }
    })
    .catch((err) => {
        throw err;
    });
});

module.exports = router;