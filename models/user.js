const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For encryption
const config = require('../config/database');

// User schema
const UserSchema = mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,     
    },
    password: {
        type: String,
        required: true,
    },
    user_groups: [{
        user_group_code: {
            type: String,
            unique: true
        },
        role: String
    }]
});

const User = module.exports = mongoose.model('User', UserSchema);

// Business logic ------

// module.exports.function allows function to be called from outside
module.exports.getUserByID = function(id, callback) {
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
    const query = {username: username};
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback) {
    // Generates a random key to hash the password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
                console.log(err);
            }
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

// Checks password validity
module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}

// Add userGroup to user
// https://stackoverflow.com/questions/29384459/inserting-elements-in-array-mongoose-creates-object-in-nodejs
module.exports.addUserGroupToUser = function(user, role, userGroup, callback) {
    const query = {_id: user._id};
    const doc = {
        $push: {
            'user_groups': {
                user_group_code: userGroup.user_group_code,
                role: role
            }
        }
    }

    User.findOneAndUpdate(query, doc, {}, callback);
}

module.exports.UserGroupInUser = function(user, userGroupCode, callback) {
    const query = {
        _id: user._id,
        user_groups: {$elemMatch: {user_group_code: userGroupCode}}
    }

    User.findOne(query, callback);
}