const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For encryption
const config = require('../config/database');

// Channel schema
const ChannelSchema = mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    messages: [{
        timestamp: String,
        msg: String
    }]
});

const Channel = module.exports = mongoose.model('Channel', ChannelSchema);


module.exports.addChannel = function(newChannel, userGroupCode, callback) {
    newChannel.save(callback);
}