
const Message = require('../models/Message');

const messageController = {
    //GET ALL MESSAGES IN A ROOM  /messages/?sender=<senderName>&receiver=<receiverName>
    getMessages: async (req, res) => {
        if(req.user !== req.query.sender && req.user !== req.query.receiver) {
            return res.sendStatus(401);
        }

        try {
            const { sender, receiver } = req.query;

            if (!sender || !receiver) {
                return res.status(400).json({ error: "Required sender and receiver" });
            }

            const messages = await Message.find({
                $or: [
                    {sender: sender, receiver: receiver},
                    {sender: receiver, receiver:sender}  //Get all messages in 2 directions
                ]
            }).sort({ createTime: 1});

            res.status(200).json(messages);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    },

    //DELETE A MESSAGE WITH ID /messages/:id
    deleteMessage: async (req, res) => {
        try {
            const { id: messageId } = req.params;

            const message = await Message.findOne({'_id': messageId});
            if (!message) {
                return res.status(404).json('Message not found');
            }
            if(req.user !== message.sender) {
                return res.sendStatus(401);
            }
            await Message.deleteOne({'_id': messageId});
            res.status(200).json('Message deleted successfully');
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    },

    //PUT: UPDATE A MESSAGE WITH ID AND CONTENT /messages/:id
    updateMessage: async (req, res) => {
        try {
            const { id: messageId } = req.params;

            const message = await Message.findOne({'_id': messageId});
            
            if (!message) {
                return res.status(404).json({message: "Message not found", id: messageId});
            }
            if(req.user !== message.sender) {
                return res.sendStatus(401);
            }

            const updatedMessage = await Message.findByIdAndUpdate(
                messageId, 
                { ...req.body, updateTime: Date.now() },
                { new: true }
            );
            res.status(200).json(updatedMessage);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    },
}

module.exports = messageController;