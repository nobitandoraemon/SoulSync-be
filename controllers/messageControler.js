
const Message = require('../models/Message');

const messageController = {
    //GET ALL MESSAGES IN A ROOM  /messages/?sender=<senderName>&receiver=<receiverName>
    getMessages: async (req, res) => {
        try {
            const { sender, receiver } = req.query;

            if (!sender || !receiver) {
                return res.status(400).json({ error: "Người nhận và người gửi là bắt buộcbuộc" });
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

            const message = await Message.findByIdAndDelete(messageId);
            if (!message) {
                return res.status(404).json('Không tìm thấy tin nhắnnhắn');
            }
            res.status(200).json('Xóa tin nhắn thành công');
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    },

    //PUT: UPDATE A MESSAGE WITH ID AND CONTENT /messages/:id
    updateMessage: async (req, res) => {
        try {
            const { id: messageId } = req.params;

            const message = await Message.findByIdAndUpdate(
                messageId, 
                { ...req.body, updateTime: Date.now() },
                { new: true }
            );
            
            if (!message) {
                return res.status(404).json({message: "Không tìm thấy tin nhắn", id: messageId});
            }

            const updated_message = await Message.findById(messageId);
            res.status(200).json(updated_message);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    },
}

module.exports = messageController;