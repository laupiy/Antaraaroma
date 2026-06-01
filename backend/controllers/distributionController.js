const db = require("../db");

function safeJson(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === "object") return val;
  try { return JSON.parse(val); } catch { return val; }
}

// GET /api/distribution
const getDistribution = async (req, res) => {
  try {
    const { status } = req.query;
    let sql = "SELECT * FROM distribution_areas";
    const params = [];

    if (status) {
      sql += " WHERE status = ?";
      params.push(status);
    }

    sql += " ORDER BY province ASC, city ASC";
    const [rows] = await db.query(sql, params);
    res.json(rows.map(mapArea));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// POST /api/distribution
const createDistribution = async (req, res) => {
  const { city, province, product_category, total_orders, latitude, longitude, status } = req.body;

  if (!city || !province) {
    return res.status(400).json({ message: "city and province are required." });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO distribution_areas
         (city, province, product_category, total_orders, latitude, longitude, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        city,
        province,
        product_category ? JSON.stringify(product_category) : null,
        total_orders || null,
        latitude || null,
        longitude || null,
        status || "Aktif",
      ]
    );
    res.status(201).json({ message: "Distribution area added.", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// PUT /api/distribution/:id
const updateDistribution = async (req, res) => {
  const { city, province, product_category, total_orders, latitude, longitude, status } = req.body;

  if (!city || !province) {
    return res.status(400).json({ message: "city and province are required." });
  }

  try {
    const [result] = await db.query(
      `UPDATE distribution_areas SET
         city=?, province=?, product_category=?, total_orders=?, latitude=?, longitude=?, status=?
       WHERE id=?`,
      [
        city,
        province,
        product_category ? JSON.stringify(product_category) : null,
        total_orders || null,
        latitude || null,
        longitude || null,
        status || "Aktif",
        req.params.id,
      ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Distribution area not found." });
    res.json({ message: "Distribution area updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// DELETE /api/distribution/:id
const deleteDistribution = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM distribution_areas WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Distribution area not found." });
    res.json({ message: "Distribution area deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// Map DB row → frontend shape (matching distributionData in DistributionArea.tsx)
function mapArea(row) {
  return {
    id:               row.id,
    city:             row.city,
    province:         row.province,
    categories:       safeJson(row.product_category) || [],  // alias for frontend
    product_category: safeJson(row.product_category) || [],
    total_orders:     row.total_orders,
    totalOrders:      row.total_orders,  // alias
    lat:              row.latitude !== null ? parseFloat(row.latitude) : null,
    lng:              row.longitude !== null ? parseFloat(row.longitude) : null,
    latitude:         row.latitude !== null ? parseFloat(row.latitude) : null,
    longitude:        row.longitude !== null ? parseFloat(row.longitude) : null,
    status:           row.status,
    created_at:       row.created_at,
    updated_at:       row.updated_at,
  };
}

module.exports = { getDistribution, createDistribution, updateDistribution, deleteDistribution };
