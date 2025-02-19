const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: String,
            require: true,
        },
        receiver: {
            type: String,
            require: true,
        },
        content: {
            type: String,
            require: true,
        },
        createTime: {
            type: Date,
            default: Date.now
        },
        updateTime: {
            type: Date,
        }
    },
    {
        versionKey: false,
    }
)

module.exports = mongoose.model("Message", messageSchema);