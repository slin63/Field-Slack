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
        type: boolean,
        required: false
    },
    user_group_code: {
        type: String,
        required: true,
        unique: true
    },
    users: [{
        userID: String,
        role: String
    }]
});

const UserGroup = module.exports = mongoose.model('UserGroup', UserGroupSchema);

// Business logic ------
module.exports.addUserGroup = function(newUserGroup, callback) {
    newUserGroup.user_group_code = generateUserGroupCode();
    newUserGroup.save(callback);
}

module.exports.getUserGroupByUserGroupCode = function(userGroupCode, callback) {
    const query = {userGroupCode: userGroupCode};
    UserGroup.findOne(query, callback);
}

module.exports.generateUserGroupCode = function() {
    //TODO;
    return 'TODO';
}

module.exports.addUserToGroup = function(user) {
    //TODO;
    return 'TODO;'
}
