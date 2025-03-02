const express = require("express");
const zodiacController = require('../../controllers/zodiacController');
const router = express.Router();

router.post('/', zodiacController.matching);

module.exports = router;