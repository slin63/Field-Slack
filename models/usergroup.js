const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For encryption
const config = require('../config/database');

// User schema
const UserGroupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    is_private: {
        type: Boolean,
        required: false
    },
    user_group_code: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    users: [{
        userID: {
            type: String
        },
        role: String
    }],
    channels: [{
        channelID: String,
        name: String,
        description: String
    }]
});

const UserGroup = module.exports = mongoose.model('UserGroup', UserGroupSchema);

// Business logic ------
module.exports.addUserGroup = function(newUserGroup, callback) {
    newUserGroup.user_group_code = this.generateUserGroupCode();
    newUserGroup.save(callback);
}

module.exports.getUserGroupByUserGroupCode = function(userGroupCode, callback) {
    if (userGroupCode == null) {
        throw Error('Attempting to look up UserGroup with NULL UserGroupCode!');
    }
    const query = {user_group_code: userGroupCode};
    UserGroup.findOne(query, callback);
}

module.exports.generateUserGroupCode = function() {
    let groupCode = "";
    const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 6; i++)
      groupCode += charSet.charAt(Math.floor(Math.random() * charSet.length));
  
    return groupCode;  
}

// https://stackoverflow.com/questions/29384459/inserting-elements-in-array-mongoose-creates-object-in-nodejs
module.exports.addUserToGroup = function(user, role, userGroup, callback) {
    const query = {_id: userGroup._id};
    const doc = {
        $push: {
            'users': {
                userID: user._id,
                role: role
            }
        }
    }

    UserGroup.findOneAndUpdate(query, doc, {}, callback);
}

module.exports.addChannelToUserGroup = function(userGroupCode, newChannel, callback) {
    const query = { user_group_code: userGroupCode };
    const doc = {
        $push: {
            channels: {
                channelID: newChannel._id,
                name: newChannel.name,
                description: newChannel.description
            }
        }
    }
    // You need to specify NEW : TRUE or else it returns the old object.
    const options =  {
        safe: true, upsert: true, new : true
    }

    UserGroup.findOneAndUpdate(query, doc, options, callback);
}

module.exports.removeChannelFromUserGroup = function(userGroupCode, channelID) {
    const query = { user_group_code: userGroupCode };
    const doc = {
        $pull: {
            channels: {
                channelID: channelID
            }
        }
    }
    // You need to specify NEW : TRUE or else it returns the old object.
    const options =  {
        safe: true, upsert: true, new : true
    }

    return UserGroup.findOneAndUpdate(query, doc, options).exec();
}

module.exports.UserInGroup = function(user, userGroupCode, callback) {
    const query = {
        user_group_code: userGroupCode,
        users: {$elemMatch: {userID: user._id.toString()}}
    }

    UserGroup.findOne(query, callback);
}

