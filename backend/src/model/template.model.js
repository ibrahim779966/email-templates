const mongoose = require("mongoose");

// ✅ Define comprehensive element schema with ALL possible properties
const elementSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true }, // 'text', 'heading', 'header', 'image', 'button', 'divider', 'shape', 'social'
    content: { type: String, default: "" },

    // Links and media
    link: { type: String, default: "" }, // For buttons/images
    href: { type: String, default: "" }, // Alternative link field
    imageUrl: { type: String, default: "" }, // For image elements
    altText: { type: String, default: "" }, // Image alt text

    // Social icons (for social element type)
    icons: [
      {
        id: Number,
        platform: String,
        url: String,
      },
    ],

    // Children elements (for section type)
    children: [{ type: mongoose.Schema.Types.Mixed }],

    // ✅ USE MIXED TYPE FOR STYLES - Accepts ANY property without filtering
    styles: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { strict: false }
); // ✅ strict: false allows any additional fields

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    workId: {
      type: String,
      required: true,
      index: true,
    },

    // // Store elements array with flexible schema
    // elements: [elementSchema],

    // ✅ USE MIXED TYPE FOR GLOBAL SETTINGS - Accepts any settings
    globalSettings: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        backgroundColor: "#f4f4f4",
        newsletterColor: "#ffffff",
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        minHeight: "800px",
        padding: "20px",
      },
    },

    // Generated HTML for email campaigns
    emailHtml: {
      type: String,
      default: "",
    },

    // Preview image URL (base64 or uploaded)
    previewImageUrl: {
      type: String,
      default: "",
    },

    // Thumbnail for gallery view
    thumbnail: {
      type: String,
      default: "",
    },
    isPublic: { type: Boolean, default: false }, // NEW FLAG
    category: {
      type: String,
      default: "Other",
      enum: [
        "Real Estate",
        "Financial Services",
        "Healthcare & Wellness",
        "Education & Training",
        "Retail & E-commerce",
        "Travel & Hospitality",
        "Technology & SaaS",
        "Media & Entertainment",
        "Automotive",
        "Professional Services",
        "Other",
      ],
    },
  },

  {
    timestamps: true,
    strict: false, // ✅ Allow additional fields at template level too
  }
);

// Index for faster queries
templateSchema.index({ workId: 1, updatedAt: -1 });

module.exports = mongoose.model("Template", templateSchema);
