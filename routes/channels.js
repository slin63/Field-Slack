const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken'); 
const config = require('../config/database');

const User = require('../models/user');
const UserGroup = require('../models/usergroup');

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


module.exports = router;