
const express = require('express');
const router = express.Router();
const refreshController = require('../controllers/refreshController');

router.get('/', (req, res) => {
    refreshController.handleRefreshToken(req, res);
});


module.exports = router;
