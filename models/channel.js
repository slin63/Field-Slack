const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For encryption
const config = require('../config/database');

mongoose.Promise = global.Promise;

// Channel schema
const ChannelSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    user_group_code: {
        type: String
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

module.exports.addChannel = function(newChannel, callback) {
    newChannel.save(callback);
}

module.exports.deleteChannel = function(channelID) {
    return Channel.findByIdAndRemove(channelID).exec();
}

