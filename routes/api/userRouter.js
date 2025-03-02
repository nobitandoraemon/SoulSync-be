const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const verifyAccessToken = require('../../middlewares/authMiddleware');

router.get("/", userController.getAllUsers);
router.get("/:username", userController.getUserByUsername);
router.use(verifyAccessToken);
router.put("/:username", userController.updateUser);
router.delete("/:username", userController.deleteUser);

module.exports = router;
