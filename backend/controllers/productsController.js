const db = require("../db");

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Safely parse JSON — returns parsed value or the original if already object/array */
function safeJson(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === "object") return val; // mysql2 already parsed JSON column
  try { return JSON.parse(val); } catch { return val; }
}

// ─── GET /api/products ────────────────────────────────────────────────────────
const getProducts = async (req, res) => {
  try {
    const { category, material, moq, search, active } = req.query;

    let sql = `
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (active !== "all") {
      sql += " AND p.is_active = 1";
    }
    if (category) {
      sql += " AND c.name = ?";
      params.push(category);
    }
    if (material) {
      sql += " AND p.material = ?";
      params.push(material);
    }
    if (moq) {
      sql += " AND p.minimum_order = ?";
      params.push(moq);
    }
    if (search) {
      sql += " AND (p.name LIKE ? OR p.product_code LIKE ? OR p.material LIKE ?)";
      const q = `%${search}%`;
      params.push(q, q, q);
    }

    sql += " ORDER BY p.date_added DESC, p.id DESC";

    const [rows] = await db.query(sql, params);

    // Parse JSON columns and map to frontend-friendly shape
    const products = rows.map(mapProduct);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// ─── GET /api/products/:id ────────────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Product not found." });

    // Also fetch approved reviews for this product
    const [reviews] = await db.query(
      `SELECT id, customer_name, rating, comment, created_at
       FROM reviews
       WHERE product_id = ? AND status = 'approved'
       ORDER BY created_at DESC`,
      [req.params.id]
    );

    const product = mapProduct(rows[0]);
    product.reviews = reviews;
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// ─── POST /api/products ───────────────────────────────────────────────────────
const createProduct = async (req, res) => {
  const {
    name, category_id, product_code, material, capacity, finish,
    minimum_order, badge, badge_color, is_new, is_popular,
    description, image_url, tags, is_active, date_added,
  } = req.body;

  if (!name) return res.status(400).json({ message: "Name is required." });

  try {
    const [result] = await db.query(
      `INSERT INTO products
         (name, category_id, product_code, material, capacity, finish,
          minimum_order, badge, badge_color, is_new, is_popular,
          description, image_url, tags, is_active, date_added)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        category_id || null,
        product_code || null,
        material || null,
        capacity ? JSON.stringify(capacity) : null,
        finish || null,
        minimum_order || null,
        badge || null,
        badge_color || null,
        is_new ? 1 : 0,
        is_popular ? 1 : 0,
        description || null,
        image_url || null,
        tags ? JSON.stringify(tags) : null,
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
        date_added || null,
      ]
    );
    res.status(201).json({ message: "Product created.", id: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Product code (SKU) already exists." });
    }
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// ─── PUT /api/products/:id ────────────────────────────────────────────────────
const updateProduct = async (req, res) => {
  const {
    name, category_id, product_code, material, capacity, finish,
    minimum_order, badge, badge_color, is_new, is_popular,
    description, image_url, tags, is_active, date_added,
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE products SET
         name=?, category_id=?, product_code=?, material=?, capacity=?, finish=?,
         minimum_order=?, badge=?, badge_color=?, is_new=?, is_popular=?,
         description=?, image_url=?, tags=?, is_active=?, date_added=?
       WHERE id=?`,
      [
        name,
        category_id || null,
        product_code || null,
        material || null,
        capacity ? JSON.stringify(capacity) : null,
        finish || null,
        minimum_order || null,
        badge || null,
        badge_color || null,
        is_new ? 1 : 0,
        is_popular ? 1 : 0,
        description || null,
        image_url || null,
        tags ? JSON.stringify(tags) : null,
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
        date_added || null,
        req.params.id,
      ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Product updated." });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Product code (SKU) already exists." });
    }
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// ─── DELETE /api/products/:id ─────────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM products WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found." });
    res.json({ message: "Product deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// ─── Map DB row → frontend shape ──────────────────────────────────────────────
function mapProduct(row) {
  return {
    id:            row.id,
    name:          row.name,
    category_id:   row.category_id,
    category:      row.category_name || null,   // frontend uses "category" string
    product_code:  row.product_code,            // SKU
    sku:           row.product_code,            // alias for frontend compatibility
    material:      row.material,
    capacity:      safeJson(row.capacity) || [],
    finish:        row.finish,
    minimum_order: row.minimum_order,
    moq:           row.minimum_order,           // alias for frontend compatibility
    badge:         row.badge,
    badge_color:   row.badge_color,
    badgeColor:    row.badge_color,             // alias
    is_new:        Boolean(row.is_new),
    isNew:         Boolean(row.is_new),         // alias
    is_popular:    Boolean(row.is_popular),
    isPopular:     Boolean(row.is_popular),     // alias
    description:   row.description,
    image_url:     row.image_url,
    image:         row.image_url,               // alias
    tags:          safeJson(row.tags) || [],
    is_active:     Boolean(row.is_active),
    date_added:    row.date_added,
    dateAdded:     row.date_added,              // alias
    created_at:    row.created_at,
    updated_at:    row.updated_at,
  };
}

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
