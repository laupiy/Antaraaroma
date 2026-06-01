const express = require("express");
const router = express.Router();
const {
  getDistribution,
  createDistribution,
  updateDistribution,
  deleteDistribution,
} = require("../controllers/distributionController");
const authMiddleware = require("../middleware/auth");

router.get("/", getDistribution);
router.post("/", authMiddleware, createDistribution);
router.put("/:id", authMiddleware, updateDistribution);
router.delete("/:id", authMiddleware, deleteDistribution);

module.exports = router;
