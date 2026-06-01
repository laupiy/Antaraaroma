const db = require("../db");

// GET /api/catalog-filters
// Returns { materials: [...], minimum_orders: [...] }
const getCatalogFilters = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM catalog_filter_options ORDER BY type ASC, sort_order ASC, value ASC"
    );
    const filters = rows.reduce(
      (acc, row) => {
        if (row.type === "material") acc.materials.push({ id: row.id, value: row.value, sort_order: row.sort_order });
        else acc.minimum_orders.push({ id: row.id, value: row.value, sort_order: row.sort_order });
        return acc;
      },
      { materials: [], minimum_orders: [] }
    );
    res.json(filters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// POST /api/catalog-filters
const createFilterOption = async (req, res) => {
  const { type, value, sort_order } = req.body;
  if (!type || !value) return res.status(400).json({ message: "type and value are required." });
  if (!["material", "minimum_order"].includes(type)) {
    return res.status(400).json({ message: "type must be 'material' or 'minimum_order'." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO catalog_filter_options (type, value, sort_order) VALUES (?, ?, ?)",
      [type, value, sort_order || 0]
    );
    res.status(201).json({ message: "Filter option created.", id: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "This filter option already exists." });
    }
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// PUT /api/catalog-filters/:id
const updateFilterOption = async (req, res) => {
  const { value, sort_order } = req.body;
  if (!value) return res.status(400).json({ message: "value is required." });

  try {
    const [result] = await db.query(
      "UPDATE catalog_filter_options SET value=?, sort_order=? WHERE id=?",
      [value, sort_order || 0, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Filter option not found." });
    res.json({ message: "Filter option updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// DELETE /api/catalog-filters/:id
const deleteFilterOption = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM catalog_filter_options WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Filter option not found." });
    res.json({ message: "Filter option deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getCatalogFilters, createFilterOption, updateFilterOption, deleteFilterOption };
