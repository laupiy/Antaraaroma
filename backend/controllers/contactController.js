const db = require("../db");

// ─── Site Contacts ────────────────────────────────────────────────────────────

// GET /api/contacts/site
const getSiteContacts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM site_contacts ORDER BY id ASC");
    // Return as key-value map for easy frontend consumption
    const map = rows.reduce((acc, row) => {
      acc[row.key_name] = { id: row.id, label: row.label, value: row.value, updated_at: row.updated_at };
      return acc;
    }, {});
    res.json(map);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// PUT /api/contacts/site/:keyName
const updateSiteContact = async (req, res) => {
  const { keyName } = req.params;
  const { label, value } = req.body;

  if (!value) return res.status(400).json({ message: "value is required." });

  try {
    await db.query(
      `INSERT INTO site_contacts (key_name, label, value)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE label = VALUES(label), value = VALUES(value), updated_at = CURRENT_TIMESTAMP`,
      [keyName, label || keyName, value]
    );
    res.json({ message: "Site contact updated.", key_name: keyName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// ─── Contact Messages ─────────────────────────────────────────────────────────

// GET /api/contacts/messages  (protected — admin only)
const getMessages = async (req, res) => {
  try {
    const { is_read } = req.query;
    let sql = "SELECT * FROM contact_messages";
    const params = [];
    if (is_read !== undefined) {
      sql += " WHERE is_read = ?";
      params.push(is_read === "true" || is_read === "1" ? 1 : 0);
    }
    sql += " ORDER BY created_at DESC";
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// POST /api/contacts/messages  (public — form submission)
const createMessage = async (req, res) => {
  const { name, email, company, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "name, email, and message are required." });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO contact_messages (name, email, company, message) VALUES (?, ?, ?, ?)",
      [name, email, company || null, message]
    );
    res.status(201).json({ message: "Message sent successfully.", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// PATCH /api/contacts/messages/:id/read  (protected)
const markMessageRead = async (req, res) => {
  try {
    const [result] = await db.query(
      "UPDATE contact_messages SET is_read = 1 WHERE id = ?",
      [req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: "Message not found." });
    res.json({ message: "Message marked as read." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// DELETE /api/contacts/messages/:id  (protected)
const deleteMessage = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM contact_messages WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Message not found." });
    res.json({ message: "Message deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getSiteContacts, updateSiteContact, getMessages, createMessage, markMessageRead, deleteMessage };
