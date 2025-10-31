// ============================================
// FILE: repository/template.model.js
// PURPOSE: Mongoose schema definition
// ============================================

const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema(
  {
    workId: {
      type: String,
      required: [true, 'Work ID is required to associate the template.'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Template name is required.'],
      trim: true,
      maxlength: 128,
    },
    cloudinaryUrl: {
      type: String,
      required: [true, 'Cloudinary URL is required.'],
      unique: true,
    },
    previewImageUrl: {
      type: String,
    },
  },
  {
    timestamps: true, // Includes createdAt and updatedAt
  }
);

// Export the Mongoose model
const Template = mongoose.model('Template', TemplateSchema);

module.exports = Template;