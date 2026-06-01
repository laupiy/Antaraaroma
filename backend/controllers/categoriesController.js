const db = require("../db");

// GET /api/categories
const getCategories = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM categories ORDER BY sort_order ASC, name ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// POST /api/categories
const createCategory = async (req, res) => {
  const { name, icon, description, is_active, sort_order } = req.body;
  if (!name) return res.status(400).json({ message: "Category name is required." });

  try {
    const [result] = await db.query(
      "INSERT INTO categories (name, icon, description, is_active, sort_order) VALUES (?, ?, ?, ?, ?)",
      [name, icon || null, description || null, is_active !== undefined ? (is_active ? 1 : 0) : 1, sort_order || 0]
    );
    res.status(201).json({ message: "Category created.", id: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Category name already exists." });
    }
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// PUT /api/categories/:id
const updateCategory = async (req, res) => {
  const { name, icon, description, is_active, sort_order } = req.body;
  if (!name) return res.status(400).json({ message: "Category name is required." });

  try {
    const [result] = await db.query(
      "UPDATE categories SET name=?, icon=?, description=?, is_active=?, sort_order=? WHERE id=?",
      [name, icon || null, description || null, is_active !== undefined ? (is_active ? 1 : 0) : 1, sort_order || 0, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found." });
    res.json({ message: "Category updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM categories WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Category not found." });
    res.json({ message: "Category deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
