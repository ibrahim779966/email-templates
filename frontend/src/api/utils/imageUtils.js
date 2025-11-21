/**
 * ============================================================================
 * COMPLETE: imageUtils.js - Full Image Upload & Cropping
 * ============================================================================
 *
 * Uses: PRESERVE ORIGINAL FORMAT APPROACH
 * - PNG files → Cropped as PNG (preserves transparency)
 * - JPEG files → Cropped as JPEG (preserves quality)
 * - Detects format from URL/filename
 *
 * Features:
 * ✅ Canvas-based image cropping with format preservation
 * ✅ Preserves original image format (PNG stays PNG, JPEG stays JPEG)
 * ✅ Cloudinary integration
 * ✅ Compression support
 * ✅ Detailed error handling and logging
 */

import axios from "axios";

// ============================================================================
// BASIC CONVERSIONS
// ============================================================================

/**
 * Convert a File object to base64 string
 * @param {File} file - The image file to convert
 * @returns {Promise<string>} - Base64 encoded image string with data URI
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      console.log("✅ File read complete, size:", reader.result.length);
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      console.error("❌ File read error:", error);
      reject(error);
    };
    console.log("📖 Starting file read...");
    reader.readAsDataURL(file);
  });
};

/**
 * Check if input is a File or Blob object
 * @param {*} input - Input to check
 * @returns {boolean}
 */
const isFileOrBlob = (input) => {
  return input instanceof File || input instanceof Blob;
};

// ============================================================================
// URL TYPE DETECTION
// ============================================================================

/**
 * Check if a string is a base64 image
 * @param {string} str - String to check
 * @returns {boolean}
 */
export const isBase64Image = (str) => {
  if (!str || typeof str !== "string") return false;
  return str.startsWith("data:image/") || str.startsWith("data:application/");
};

/**
 * Check if a string is a Cloudinary URL
 * @param {string} str - String to check
 * @returns {boolean}
 */
export const isCloudinaryUrl = (str) => {
  if (!str || typeof str !== "string") return false;
  return str.includes("cloudinary.com") || str.includes("res.cloudinary");
};

/**
 * Check if a string is a regular URL (http/https)
 * @param {string} str - String to check
 * @returns {boolean}
 */
const isHttpUrl = (str) => {
  if (!str || typeof str !== "string") return false;
  return str.startsWith("http://") || str.startsWith("https://");
};

/**
 * Check if a string is a blob URL
 * @param {string} str - String to check
 * @returns {boolean}
 */
const isBlobUrl = (str) => {
  if (!str || typeof str !== "string") return false;
  return str.startsWith("blob:");
};

/**
 * Check if a string is a data URL
 * @param {string} str - String to check
 * @returns {boolean}
 */
const isDataUrl = (str) => {
  if (!str || typeof str !== "string") return false;
  return str.startsWith("data:");
};

// ============================================================================
// IMAGE FORMAT DETECTION
// ============================================================================

/**
 * ✅ PRESERVE ORIGINAL FORMAT APPROACH
 * Detect original image format from URL, filename, or data URI
 * @param {string} imageSrc - Image source (URL or base64)
 * @returns {string} - Format: 'png', 'jpeg', 'gif', 'webp', or 'jpeg' (default)
 */
export function detectImageFormat(imageSrc) {
  if (!imageSrc || typeof imageSrc !== "string") {
    console.warn("⚠️ Could not detect format, defaulting to jpeg");
    return "jpeg";
  }

  // Check data URI format
  if (imageSrc.includes("data:image/png")) {
    console.log("🎨 Format detected: PNG (from data URI)");
    return "png";
  }
  if (
    imageSrc.includes("data:image/jpeg") ||
    imageSrc.includes("data:image/jpg")
  ) {
    console.log("🎨 Format detected: JPEG (from data URI)");
    return "jpeg";
  }
  if (imageSrc.includes("data:image/gif")) {
    console.log("🎨 Format detected: GIF (from data URI)");
    return "gif";
  }
  if (imageSrc.includes("data:image/webp")) {
    console.log("🎨 Format detected: WebP (from data URI)");
    return "webp";
  }

  // Check URL filename extension
  if (imageSrc.includes(".png")) {
    console.log("🎨 Format detected: PNG (from filename)");
    return "png";
  }
  if (imageSrc.includes(".jpg") || imageSrc.includes(".jpeg")) {
    console.log("🎨 Format detected: JPEG (from filename)");
    return "jpeg";
  }
  if (imageSrc.includes(".gif")) {
    console.log("🎨 Format detected: GIF (from filename)");
    return "gif";
  }
  if (imageSrc.includes(".webp")) {
    console.log("🎨 Format detected: WebP (from filename)");
    return "webp";
  }

  console.warn("⚠️ Format not detected, defaulting to jpeg");
  return "jpeg"; // Default fallback
}

/**
 * Get MIME type from format string
 * @param {string} format - Format: 'png', 'jpeg', 'gif', 'webp'
 * @returns {string} - MIME type
 */
function getImageMimeType(format) {
  const mimeTypes = {
    png: "image/png",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
  };
  return mimeTypes[format?.toLowerCase()] || "image/jpeg";
}

/**
 * Get quality setting for format
 * @param {string} format - Format: 'png', 'jpeg', 'gif', 'webp'
 * @returns {number|undefined} - Quality 0-1 (undefined for lossless formats)
 */
function getQualityForFormat(format) {
  const format_lower = format?.toLowerCase();
  // Lossless formats don't need quality parameter
  if (format_lower === "png" || format_lower === "gif") {
    return undefined;
  }
  // Lossy formats use quality
  return 0.95; // High quality
}

// ============================================================================
// URL CONVERSIONS
// ============================================================================

/**
 * Fetch blob URL and convert to base64
 * @param {string} blobUrl - Blob URL to fetch
 * @returns {Promise<string>} - Base64 string
 */
const blobUrlToBase64 = async (blobUrl) => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return await fileToBase64(blob);
};

/**
 * Fetch regular URL and convert to base64
 * @param {string} url - URL to fetch
 * @returns {Promise<string>} - Base64 string
 */
const urlToBase64 = async (url) => {
  try {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    return await fileToBase64(blob);
  } catch (error) {
    console.warn("Could not fetch URL, returning as-is:", url);
    return url;
  }
};

// ============================================================================
// UPLOAD TO CLOUDINARY
// ============================================================================

/**
 * Upload base64 or File to Cloudinary via backend API
 * @param {string|File|Blob} input - Base64 string, File, or Blob
 * @param {Function} onProgress - Optional callback for upload progress (0-100)
 * @returns {Promise<string>} - Cloudinary URL
 */
export async function uploadImageToCloudinary(input, onProgress) {
  try {
    let base64Image;

    console.log("📤 Starting upload process...");
    console.log(
      "📋 Input type:",
      isFileOrBlob(input) ? "Blob/File" : typeof input
    );

    // Convert input to base64 if needed
    if (isFileOrBlob(input)) {
      console.log("🔄 Converting Blob/File to base64...");
      base64Image = await fileToBase64(input);
      console.log("✅ Conversion complete, size:", base64Image.length);
    } else if (typeof input === "string") {
      if (isBase64Image(input)) {
        console.log("✅ Already base64 data URI");
        base64Image = input;
      } else if (isHttpUrl(input)) {
        console.log("🌐 Converting HTTP URL to base64...");
        base64Image = await urlToBase64(input);
      } else if (isBlobUrl(input)) {
        console.log("🔗 Converting blob URL to base64...");
        base64Image = await blobUrlToBase64(input);
      } else {
        throw new Error("Unsupported URL format");
      }
    } else {
      throw new Error("Invalid input: must be File, Blob, or URL string");
    }

    // Upload to Cloudinary via backend
    console.log("🌐 Calling backend API...");
    const apiUrl = `${
      import.meta.env.VITE_API_BASE_URL
    }/templates/upload-image`;
    console.log("📍 API URL:", apiUrl);

    const response = await axios.post(
      apiUrl,
      { image: base64Image },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 60000,
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`📊 Upload progress: ${progress}%`);
            onProgress(progress);
          }
        },
      }
    );

    console.log("📥 Response received");

    const url = response.data?.data?.url || response.data?.url;

    if (!url) {
      console.error("❌ No URL in response:", response.data);
      throw new Error("No URL returned from server");
    }

    console.log("✅ Upload successful:", url.substring(0, 100) + "...");
    return url;
  } catch (error) {
    console.error("❌ Upload error:", error.message);
    if (error.response) {
      console.error("📋 Status:", error.response.status);
      console.error("📋 Data:", error.response.data);
    }
    throw error;
  }
}

/**
 * Upload multiple images to Cloudinary
 * @param {Array<File|string|Blob>} inputs - Array of any image inputs
 * @param {Function} onProgress - Optional callback for overall progress (0-100)
 * @returns {Promise<string[]>} - Array of Cloudinary URLs
 */
export async function uploadMultipleImages(inputs, onProgress) {
  try {
    console.log("📤 Starting batch upload of", inputs.length, "images");

    const uploadPromises = inputs.map((input, index) =>
      uploadImageToCloudinary(input, (progress) => {
        const totalProgress = ((index + progress / 100) / inputs.length) * 100;
        if (onProgress) onProgress(Math.round(totalProgress));
      })
    );

    const urls = await Promise.all(uploadPromises);
    console.log("✅ Batch upload complete:", urls.length, "images");
    return urls;
  } catch (error) {
    console.error("❌ Batch upload error:", error);
    throw error;
  }
}

// ============================================================================
// CANVAS CROPPING - PRESERVE ORIGINAL FORMAT
// ============================================================================

/**
 * ✅ PRESERVE ORIGINAL FORMAT APPROACH
 * Crop image on canvas, preserving the original image format
 * PNG → PNG (with transparency preserved)
 * JPEG → JPEG (no transparency, smaller files)
 *
 * @param {string} imageSrc - Original image source (URL or base64)
 * @param {Object} cropData - {x, y, width, height} crop coordinates
 * @param {boolean} uploadToCloud - If true, upload to Cloudinary (default: true)
 * @returns {Promise<string>} - Cloudinary URL or base64 string
 */
export async function cropImageOnCanvas(
  imageSrc,
  cropData,
  uploadToCloud = true
) {
  return new Promise((resolve, reject) => {
    console.log("🎬 Starting canvas crop");
    console.log("✂️ Crop data:", cropData);

    // ✅ DETECT FORMAT FROM ORIGINAL IMAGE
    const originalFormat = detectImageFormat(imageSrc);
    const mimeType = getImageMimeType(originalFormat);
    const quality = getQualityForFormat(originalFormat);

    console.log("🎯 Preserving original format:", originalFormat);
    console.log("📝 MIME type:", mimeType);
    console.log("⚙️ Quality:", quality);

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      console.log("✅ Image loaded successfully");
      console.log(
        "🖼️ Natural dimensions:",
        img.naturalWidth,
        "×",
        img.naturalHeight
      );

      try {
        // Create canvas with cropped dimensions
        const canvas = document.createElement("canvas");
        canvas.width = cropData.width;
        canvas.height = cropData.height;

        console.log("📐 Canvas created:", canvas.width, "×", canvas.height);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Failed to get canvas 2D context");
        }

        // ✅ Don't fill canvas - keep transparent by default
        // This preserves PNG transparency

        // Draw the cropped portion
        console.log("🎨 Drawing crop region");
        ctx.drawImage(
          img,
          cropData.x, // source x
          cropData.y, // source y
          cropData.width, // source width
          cropData.height, // source height
          0, // dest x
          0, // dest y
          cropData.width, // dest width
          cropData.height // dest height
        );

        // Convert to blob using ORIGINAL FORMAT
        console.log("🔄 Converting canvas to blob...");
        canvas.toBlob(
          async (blob) => {
            try {
              if (!blob) {
                throw new Error("Canvas toBlob returned null");
              }

              console.log(
                "📦 Blob created",
                "Format:",
                originalFormat,
                "Size:",
                blob.size,
                "bytes"
              );

              if (uploadToCloud) {
                console.log("☁️ Uploading to Cloudinary...");
                const croppedUrl = await uploadImageToCloudinary(blob);
                console.log("✅ Crop uploaded:", croppedUrl.substring(0, 100));
                resolve(croppedUrl);
              } else {
                console.log("📝 Converting to base64...");
                const croppedBase64 = await fileToBase64(blob);
                console.log("✅ Base64 created, size:", croppedBase64.length);
                resolve(croppedBase64);
              }
            } catch (error) {
              console.error("❌ Blob processing error:", error);
              reject(error);
            }
          },
          mimeType, // ✅ Use ORIGINAL format
          quality // Quality only for lossy formats
        );
      } catch (error) {
        console.error("❌ Canvas drawing error:", error);
        reject(new Error("Canvas crop failed: " + error.message));
      }
    };

    img.onerror = () => {
      console.error("❌ Image failed to load - CORS issue?");
      reject(new Error("Failed to load image. Check CORS settings."));
    };

    console.log("📥 Loading image...");
    img.src = imageSrc;
  });
}

/**
 * Apply canvas crop to element and update it
 * Preserves original image format
 *
 * @param {Object} element - Image element
 * @param {Object} cropData - Crop metadata {x, y, width, height}
 * @param {Function} updateElement - Callback to update element
 * @param {boolean} uploadToCloud - If true, upload to Cloudinary (default: true)
 * @returns {Promise<boolean>}
 */
export async function applyCanvasCropToElement(
  element,
  cropData,
  updateElement,
  uploadToCloud = true
) {
  try {
    console.log("🔄 Starting crop application");
    console.log("📸 Element ID:", element.id);
    console.log("✂️ Crop data:", cropData);

    if (!element.content) {
      throw new Error("No image content found");
    }

    // Validate crop data
    if (
      !cropData.width ||
      !cropData.height ||
      cropData.width <= 0 ||
      cropData.height <= 0
    ) {
      throw new Error("Invalid crop dimensions");
    }

    // Crop and upload
    console.log("🎬 Cropping image...");
    const croppedImageUrl = await cropImageOnCanvas(
      element.content,
      cropData,
      uploadToCloud
    );

    console.log("📝 Updating element with new URL");

    // Update element with cropped image
    // ✅ CRITICAL: Pass complete update object
    updateElement(element.id, {
      content: croppedImageUrl, // NEW cropped URL
      cropData: cropData, // Store metadata
      originalContent: element.content, // Keep original
    });

    console.log("✅ Image cropped and element updated successfully");
    return true;
  } catch (error) {
    console.error("❌ Crop application failed:", error);
    throw error;
  }
}

/**
 * Crop multiple images
 * @param {Array<Object>} elements - Array of image elements
 * @param {Array<Object>} cropDataArray - Array of crop data
 * @param {Function} updateElement - Callback to update elements
 * @returns {Promise<boolean>}
 */
export async function applyMultipleCrops(
  elements,
  cropDataArray,
  updateElement
) {
  try {
    console.log("🔄 Starting batch crop of", elements.length, "images");

    const cropPromises = elements.map((element, index) =>
      applyCanvasCropToElement(
        element,
        cropDataArray[index],
        updateElement,
        true
      )
    );

    await Promise.all(cropPromises);
    console.log("✅ Batch crop complete");
    return true;
  } catch (error) {
    console.error("❌ Batch crop failed:", error);
    throw error;
  }
}

// ============================================================================
// COMPRESSION
// ============================================================================

/**
 * Compress image before upload
 * @param {File} file - Image file to compress
 * @param {number} maxWidth - Maximum width in pixels (default: 1920)
 * @param {number} quality - JPEG quality 0-1 (default: 0.9)
 * @returns {Promise<string>} - Compressed base64 image
 */
export function compressImage(file, maxWidth = 1920, quality = 0.9) {
  return new Promise((resolve, reject) => {
    console.log("🗜️ Starting image compression");

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        console.log("📐 Compressed to:", width, "×", height);

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        console.log("✅ Compression complete");
        resolve(compressedBase64);
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Compress and upload image
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum width in pixels
 * @param {number} quality - JPEG quality 0-1
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<string>} - Cloudinary URL
 */
export async function compressAndUpload(
  file,
  maxWidth = 1920,
  quality = 0.9,
  onProgress
) {
  try {
    if (onProgress) onProgress(25);

    // Compress
    const compressedBase64 = await compressImage(file, maxWidth, quality);
    if (onProgress) onProgress(50);

    // Upload
    const url = await uploadImageToCloudinary(compressedBase64, (progress) => {
      if (onProgress) onProgress(50 + progress * 0.5);
    });

    if (onProgress) onProgress(100);
    console.log("✅ Compress and upload complete");
    return url;
  } catch (error) {
    console.error("❌ Compress and upload error:", error);
    throw error;
  }
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate image file
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum file size in MB (default: 10)
 * @returns {Object} - { valid: boolean, error: string }
 */
export function validateImageFile(file, maxSizeMB = 10) {
  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File must be an image" };
  }

  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Validate crop data
 * @param {Object} cropData - Crop data to validate
 * @returns {Object} - { valid: boolean, error: string }
 */
export function validateCropData(cropData) {
  if (!cropData) {
    return { valid: false, error: "No crop data provided" };
  }

  const { x, y, width, height } = cropData;

  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    typeof width !== "number" ||
    typeof height !== "number"
  ) {
    return { valid: false, error: "Crop data must contain numbers" };
  }

  if (x < 0 || y < 0 || width <= 0 || height <= 0) {
    return { valid: false, error: "Invalid crop coordinates" };
  }

  return { valid: true };
}

// ============================================================================
// PREVIEW & CLEANUP
// ============================================================================

/**
 * Create a preview URL for an image file
 * @param {File} file - Image file
 * @returns {string} - Object URL for preview
 */
export const createImagePreview = (file) => {
  return URL.createObjectURL(file);
};

/**
 * Revoke preview URL to free memory
 * @param {string} url - Object URL to revoke
 */
export const revokeImagePreview = (url) => {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Process image URL - uploads to Cloudinary if needed
 * @param {File|string|Blob} input - Any image input
 * @returns {Promise<string>} - Cloudinary URL
 */
export const processImageUrl = async (input) => {
  return await uploadImageToCloudinary(input);
};

/**
 * Get image dimensions
 * @param {string} imageSrc - Image URL or base64
 * @returns {Promise<{width: number, height: number}>}
 */
export async function getImageDimensions(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () =>
      reject(new Error("Failed to load image for dimension check"));

    img.src = imageSrc;
  });
}

/**
 * Calculate crop aspect ratio
 * @param {Object} cropData - Crop data {x, y, width, height}
 * @returns {number} - Aspect ratio (width / height)
 */
export function calculateCropAspectRatio(cropData) {
  return cropData.width / cropData.height;
}

/**
 * Calculate scaled dimensions maintaining aspect ratio
 * @param {number} originalWidth - Original width
 * @param {number} originalHeight - Original height
 * @param {number} maxWidth - Max width constraint
 * @param {number} maxHeight - Max height constraint
 * @returns {{width: number, height: number}}
 */
export function calculateScaledDimensions(
  originalWidth,
  originalHeight,
  maxWidth,
  maxHeight
) {
  let width = originalWidth;
  let height = originalHeight;
  const aspectRatio = width / height;

  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Format Detection (✅ PRESERVE ORIGINAL FORMAT)
  detectImageFormat,
  getImageMimeType,

  // Conversions
  fileToBase64,
  isBase64Image,
  isCloudinaryUrl,

  // Upload
  uploadImageToCloudinary,
  uploadMultipleImages,

  // Canvas Cropping (✅ PRESERVE ORIGINAL FORMAT)
  cropImageOnCanvas,
  applyCanvasCropToElement,
  applyMultipleCrops,

  // Compression
  compressImage,
  compressAndUpload,

  // Validation
  validateImageFile,
  validateCropData,

  // Preview & Cleanup
  createImagePreview,
  revokeImagePreview,

  // Utilities
  processImageUrl,
  getImageDimensions,
  calculateCropAspectRatio,
  calculateScaledDimensions,
};
