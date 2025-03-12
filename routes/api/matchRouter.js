const express = require("express");
const matchController = require('../../controllers/matchController');
const router = express.Router();

router.post('/', matchController.matching);

module.exports = router;