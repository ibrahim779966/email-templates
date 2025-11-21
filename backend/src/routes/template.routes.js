const express = require("express");
const templateController = require("../controllers/template.controller");
// const { authenticate } = require('../middleware/auth.middleware');
const router = express.Router();

// For now, no auth middleware

// ============================================
// IMPORTANT: Place specific routes BEFORE parameterized routes
// to avoid conflicts (e.g., "upload-image" being treated as an ID)
// ============================================

// Create a new template (auto-uploads images to Cloudinary)
router.post("/", templateController.createTemplate);

// NEW: Upload single image to Cloudinary
router.post("/upload-image", templateController.uploadImage);
// Get all public templates
router.get("/public", templateController.getPublicTemplates);

// Get all templates by work ID
router.get("/work/:workId", templateController.getTemplatesByWorkId);

// Get email HTML from template (uses Cloudinary URLs)
router.get("/:id/email-html", templateController.getEmailHtml);

// Get a single template by ID
router.get("/:id", templateController.getTemplateById);

// Update a template (auto-uploads new images to Cloudinary)
router.put("/:id", templateController.updateTemplate);

// Delete a template
router.delete("/:id", templateController.deleteTemplate);

module.exports = router;
