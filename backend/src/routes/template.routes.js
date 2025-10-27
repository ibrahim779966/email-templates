const express = require('express');
const templateController = require('../controllers/template.controller');
const router = express.Router();

/**
 * Base URL for this router: /api/v1/templates
 */

router.post('/', templateController.createTemplate); // C
router.get('/work/:workId', templateController.getTemplatesByWorkId); // R (All by User)
router.get('/:id', templateController.getTemplateById); // R (Single)
router.put('/:id', templateController.updateTemplate); // U
router.delete('/:id', templateController.deleteTemplate); // D

module.exports = router;