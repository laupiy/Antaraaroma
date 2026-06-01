const db = require("../db");

function safeJson(val) {
  if (!val) return null;
  if (typeof val === "object") return val;
  try { return JSON.parse(val); } catch { return val; }
}

// GET /api/home-content
const getHomeContent = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM home_contents");
    // Return as object keyed by section_key; value is parsed JSON
    const content = rows.reduce((acc, row) => {
      acc[row.section_key] = {
        id:           row.id,
        content:      safeJson(row.content_json),
        content_json: row.content_json,
        updated_at:   row.updated_at,
      };
      return acc;
    }, {});
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// PUT /api/home-content/:sectionKey
const updateHomeContent = async (req, res) => {
  const { sectionKey } = req.params;
  const { content, content_json } = req.body;

  // Accept either { content: object } or { content_json: "string" }
  let jsonStr;
  if (content_json !== undefined) {
    jsonStr = typeof content_json === "string" ? content_json : JSON.stringify(content_json);
  } else if (content !== undefined) {
    jsonStr = typeof content === "string" ? content : JSON.stringify(content);
  } else {
    return res.status(400).json({ message: "content or content_json is required." });
  }

  try {
    await db.query(
      `INSERT INTO home_contents (section_key, content_json)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), updated_at = CURRENT_TIMESTAMP`,
      [sectionKey, jsonStr]
    );
    res.json({ message: "Home content updated.", section_key: sectionKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = { getHomeContent, updateHomeContent };
