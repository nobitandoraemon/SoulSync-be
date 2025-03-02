const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/messageControler');

//GET ALL MESSAGES IN A ROOM
router.get('/', messageController.getMessages);

//DELETE A MESSAGE
router.route('/:id').delete(messageController.deleteMessage)
                    .put(messageController.updateMessage);

module.exports = router;
