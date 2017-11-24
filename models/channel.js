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
        user_group_code: String,
        user_name: String,
        timestamp: String,
        content: String
    }]
});

ChannelSchema.index({
    name: 1,
    user_group_code: -1
}, { unique: true });


const Channel = module.exports = mongoose.model('Channel', ChannelSchema);

module.exports.addChannel = function(newChannel, callback) {
    newChannel.save(callback);
}

module.exports.getChannelByID = function(channelID) {
    return Channel.findById(channelID).exec();
}

module.exports.deleteChannel = function(channelID) {
    return Channel.findByIdAndRemove(channelID).exec();
}

module.exports.getChannels = function(userGroupCode) {
    const query = {
        user_group_code: userGroupCode
    }

    return Channel.find(query).exec();
}

module.exports.addMessage = function(channelID, newMessage) {
    const doc = {
        $push: {
            messages: {
                user_group_code: newMessage.user_group_code,
                user_name: newMessage.user_name,
                timestamp: newMessage.timestamp,
                content: newMessage.content
            }
        }
    }
    // You need to specify NEW : TRUE or else it returns the old object.
    const options =  {
        safe: true, upsert: true, new: true
    }

    return Channel.findByIdAndUpdate(channelID, doc, options).exec();
}

module.exports.editChannel = function(channelID, channelEdits) {
    const options = {
        upsert: true,
        new: true
    }

    return Channel.findByIdAndUpdate(channelID, channelEdits, options).exec();
}
