const db = require("../db");

// ─── GET /api/reviews  (public — hanya approved) ──────────────────────────────
const getReviews = async (req, res) => {
  try {
    const { product_id } = req.query;
    let sql = `
      SELECT r.*, p.name AS product_name
      FROM reviews r
      LEFT JOIN products p ON r.product_id = p.id
      WHERE r.status = 'approved'
    `;
    const params = [];

    if (product_id) {
      sql += " AND r.product_id = ?";
      params.push(product_id);
    }

    sql += " ORDER BY r.created_at DESC";
    const [rows] = await db.query(sql, params);
    res.json(rows.map(mapReview));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// ─── GET /api/reviews/admin  (protected — semua review) ───────────────────────
const getReviewsAdmin = async (req, res) => {
  try {
    const { status, product_id } = req.query;
    let sql = `
      SELECT r.*, p.name AS product_name
      FROM reviews r
      LEFT JOIN products p ON r.product_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      sql += " AND r.status = ?";
      params.push(status);
    }
    if (product_id) {
      sql += " AND r.product_id = ?";
      params.push(product_id);
    }

    sql += " ORDER BY r.created_at DESC";
    const [rows] = await db.query(sql, params);
    res.json(rows.map(mapReview));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// ─── POST /api/reviews  (public) ─────────────────────────────────────────────
const createReview = async (req, res) => {
  const { product_id, customer_name, rating, comment } = req.body;

  if (!customer_name || !rating || !comment) {
    return res.status(400).json({ message: "customer_name, rating, and comment are required." });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO reviews (product_id, customer_name, rating, comment, status) VALUES (?, ?, ?, ?, 'pending')",
      [product_id || null, customer_name, rating, comment]
    );
    res.status(201).json({
      message: "Review submitted. Awaiting approval.",
      id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// ─── PATCH /api/reviews/:id/approve  (protected) ─────────────────────────────
const approveReview = async (req, res) => {
  try {
    const [result] = await db.query(
      "UPDATE reviews SET status = 'approved' WHERE id = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Review not found." });
    res.json({ message: "Review approved." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// ─── PATCH /api/reviews/:id/reject  (protected) ──────────────────────────────
const rejectReview = async (req, res) => {
  try {
    const [result] = await db.query(
      "UPDATE reviews SET status = 'rejected' WHERE id = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Review not found." });
    res.json({ message: "Review rejected." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// ─── DELETE /api/reviews/:id  (protected) ────────────────────────────────────
const deleteReview = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM reviews WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Review not found." });
    res.json({ message: "Review deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// ─── Map DB row → frontend Review shape ──────────────────────────────────────
function mapReview(row) {
  return {
    id:            row.id,
    product_id:    row.product_id,
    productId:     row.product_id,           // alias
    product_name:  row.product_name || null,
    productName:   row.product_name || null, // alias
    customer_name: row.customer_name,
    customerName:  row.customer_name,        // alias
    rating:        row.rating,
    comment:       row.comment,
    status:        row.status,
    created_at:    row.created_at,
    dateAdded:     row.created_at,           // alias
  };
}

module.exports = {
  getReviews,
  getReviewsAdmin,
  createReview,
  approveReview,
  rejectReview,
  deleteReview,
};
