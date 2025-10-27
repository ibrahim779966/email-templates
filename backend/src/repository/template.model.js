const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema(
  {
    workId: {
      type: String, // The specific work id (user ID or project ID)
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
      unique: true, // Ensures the same asset link isn't saved twice
    },
    previewImageUrl: {
      type: String,
    },
  },
  {
    timestamps: true, // Includes createdAt and updatedAt
  }
);

// Mongoose model acts as the Repository
const TemplateRepository = mongoose.model('Template', TemplateSchema);

module.exports = TemplateRepository;