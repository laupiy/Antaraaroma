const express = require("express");
const router = express.Router();
const {
  getReviews,
  getReviewsAdmin,
  createReview,
  approveReview,
  rejectReview,
  deleteReview,
} = require("../controllers/reviewsController");
const authMiddleware = require("../middleware/auth");

router.get("/",        getReviews);           // public: approved only
router.get("/admin",   authMiddleware, getReviewsAdmin);  // protected: all
router.post("/",       createReview);          // public: submit
router.patch("/:id/approve", authMiddleware, approveReview);
router.patch("/:id/reject",  authMiddleware, rejectReview);
router.delete("/:id",        authMiddleware, deleteReview);

module.exports = router;
