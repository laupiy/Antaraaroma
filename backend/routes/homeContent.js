const express = require("express");
const router = express.Router();
const { getHomeContent, updateHomeContent } = require("../controllers/homeContentController");
const authMiddleware = require("../middleware/auth");

router.get("/", getHomeContent);
router.put("/:sectionKey", authMiddleware, updateHomeContent);

module.exports = router;
