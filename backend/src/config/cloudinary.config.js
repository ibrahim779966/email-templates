// ============================================
// FILE: config/cloudinary.config.js
// PURPOSE: Cloudinary configuration and utility functions
// ============================================

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload base64 image to Cloudinary
 * @param {string} base64Image - Base64 encoded image string
 * @param {string} folder - Folder name in Cloudinary (optional)
 * @returns {Promise<string>} - Returns Cloudinary URL
 */
async function uploadBase64ToCloudinary(base64Image, folder = 'templates') {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    // Return the secure URL (shorter URL)
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} buffer - Image buffer
 * @param {string} folder - Folder name in Cloudinary (optional)
 * @returns {Promise<string>} - Returns Cloudinary URL
 */
async function uploadBufferToCloudinary(buffer, folder = 'templates') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new Error('Failed to upload image to Cloudinary'));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete image from Cloudinary
 * @param {string} imageUrl - Cloudinary image URL
 * @returns {Promise<void>}
 */
async function deleteFromCloudinary(imageUrl) {
  try {
    // Extract public_id from URL
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = filename.split('.')[0];
    const folder = urlParts[urlParts.length - 2];
    const fullPublicId = `${folder}/${publicId}`;

    await cloudinary.uploader.destroy(fullPublicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    // Don't throw error on delete failure
  }
}

/**
 * Process elements and upload images to Cloudinary
 * @param {Array} elements - Array of template elements
 * @returns {Promise<Array>} - Returns elements with Cloudinary URLs
 */
async function processElementsImages(elements) {
  if (!elements || !Array.isArray(elements)) {
    return elements;
  }

  const processedElements = [];

  for (const element of elements) {
    const processedElement = { ...element };

    // If element has imageUrl and it's a base64 string, upload to Cloudinary
    if (processedElement.imageUrl && isBase64Image(processedElement.imageUrl)) {
      try {
        const cloudinaryUrl = await uploadBase64ToCloudinary(processedElement.imageUrl);
        processedElement.imageUrl = cloudinaryUrl;
      } catch (error) {
        console.error('Error uploading image for element:', element.id, error);
        // Keep original URL if upload fails
      }
    }

    // Recursively process children if they exist
    if (processedElement.children && Array.isArray(processedElement.children)) {
      processedElement.children = await processElementsImages(processedElement.children);
    }

    processedElements.push(processedElement);
  }

  return processedElements;
}

/**
 * Check if string is a base64 image
 * @param {string} str - String to check
 * @returns {boolean}
 */
function isBase64Image(str) {
  if (!str || typeof str !== 'string') return false;
  
  // Check if it starts with data:image
  return str.startsWith('data:image/');
}

module.exports = {
  cloudinary,
  uploadBase64ToCloudinary,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  processElementsImages,
  isBase64Image,
};