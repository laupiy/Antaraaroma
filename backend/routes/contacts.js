const express = require("express");
const router = express.Router();
const {
  getSiteContacts,
  updateSiteContact,
  getMessages,
  createMessage,
  markMessageRead,
  deleteMessage,
} = require("../controllers/contactController");
const authMiddleware = require("../middleware/auth");

// Site contacts (data tetap website)
router.get("/site",              getSiteContacts);
router.put("/site/:keyName",     authMiddleware, updateSiteContact);

// Contact messages (pesan dari form customer)
router.get("/messages",          authMiddleware, getMessages);
router.post("/messages",         createMessage);
router.patch("/messages/:id/read",   authMiddleware, markMessageRead);
router.delete("/messages/:id",       authMiddleware, deleteMessage);

module.exports = router;
