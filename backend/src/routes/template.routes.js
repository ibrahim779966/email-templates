// ============================================
// FILE: routes/template.routes.js
// PURPOSE: Define API routes and map to controller methods
// RESPONSIBILITIES: Route registration and HTTP method mapping
// ============================================

const express = require('express');
const templateController = require('../controllers/template.controller');
const router = express.Router();

/**
 * Base URL for this router: /api/v1/templates
 */

// Create a new template
router.post('/', templateController.createTemplate);

// Get all templates by work ID
router.get('/work/:workId', templateController.getTemplatesByWorkId);

// Get a single template by ID
router.get('/:id', templateController.getTemplateById);

// Update a template by ID
router.put('/:id', templateController.updateTemplate);

// Delete a template by ID
router.delete('/:id', templateController.deleteTemplate);

module.exports = router;
