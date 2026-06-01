const express = require("express");
const router = express.Router();
const {
  getCatalogFilters,
  createFilterOption,
  updateFilterOption,
  deleteFilterOption,
} = require("../controllers/catalogFilterController");
const authMiddleware = require("../middleware/auth");

router.get("/",      getCatalogFilters);
router.post("/",     authMiddleware, createFilterOption);
router.put("/:id",   authMiddleware, updateFilterOption);
router.delete("/:id",authMiddleware, deleteFilterOption);

module.exports = router;
