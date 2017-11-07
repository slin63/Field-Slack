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
    registration_code: {
        type: String,
        required: true,
        unique: true
    },
    users: [{
        userID: mongoose.Types.ObjectId,
        role: String
    }]

});

const User = module.exports = mongoose.model('User', UserSchema);

// Business logic ------

