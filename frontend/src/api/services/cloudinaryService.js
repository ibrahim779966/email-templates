/**
 * Cloudinary Service
 * Handles Cloudinary uploads with proper error handling
 */

import axios from "axios";
import apiUrls from "../config/apiUrls";
import { CLOUDINARY_CONSTANTS } from "../../constants/apiConstants";
import {
  parseApiError,
  validateFileType,
  validateFileSize,
} from "../utils/requestHelper";

// File upload constraints
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

/**
 * Upload an image to Cloudinary
 */
const uploadImage = async (imageBlob, publicId = null, options = {}) => {
  try {
    // Validate file
    if (imageBlob instanceof File) {
      if (!validateFileType(imageBlob, ALLOWED_IMAGE_TYPES)) {
        throw new Error("Invalid file type. Only images are allowed.");
      }

      if (!validateFileSize(imageBlob, options.maxSize || MAX_FILE_SIZE)) {
        throw new Error(
          `File size exceeds maximum allowed size of ${
            MAX_FILE_SIZE / 1024 / 1024
          }MB`
        );
      }
    }

    const formData = new FormData();
    formData.append("file", imageBlob);
    formData.append("upload_preset", apiUrls.cloudinary.upload_preset);

    if (publicId) {
      formData.append("public_id", publicId);
    }

    // Add additional options
    if (options.folder) {
      formData.append("folder", options.folder);
    }

    if (options.tags) {
      formData.append(
        "tags",
        Array.isArray(options.tags) ? options.tags.join(",") : options.tags
      );
    }

    const response = await axios.post(
      apiUrls.cloudinary.image_upload_url,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: options.onProgress,
      }
    );

    return {
      success: true,
      secure_url: response.data.secure_url,
      public_id: response.data.public_id,
      width: response.data.width,
      height: response.data.height,
      format: response.data.format,
      resource_type: response.data.resource_type,
      created_at: response.data.created_at,
    };
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error("Error uploading image to Cloudinary:", parsedError);
    throw {
      success: false,
      message: parsedError.message || "Failed to upload image",
      error: parsedError,
    };
  }
};

/**
 * Upload raw data (JSON) to Cloudinary
 */
const uploadRawData = async (data, publicId = null, options = {}) => {
  try {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("upload_preset", apiUrls.cloudinary.upload_preset);
    formData.append("resource_type", CLOUDINARY_CONSTANTS.RESOURCE_TYPES.RAW);

    if (publicId) {
      formData.append("public_id", publicId);
    }

    // Add additional options
    if (options.folder) {
      formData.append("folder", options.folder);
    }

    const response = await axios.post(
      apiUrls.cloudinary.raw_upload_url,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: options.onProgress,
      }
    );

    return {
      success: true,
      secure_url: response.data.secure_url,
      public_id: response.data.public_id,
      resource_type: response.data.resource_type,
      created_at: response.data.created_at,
    };
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error("Error uploading raw data to Cloudinary:", parsedError);
    throw {
      success: false,
      message: parsedError.message || "Failed to upload data",
      error: parsedError,
    };
  }
};

/**
 * Fetch data from a Cloudinary URL
 */
const fetchCloudinaryData = async (cloudinaryUrl) => {
  try {
    if (!cloudinaryUrl) {
      throw new Error("Cloudinary URL is required");
    }

    console.log("Fetching from Cloudinary:", cloudinaryUrl); // ADD THIS

    const response = await axios.get(cloudinaryUrl, {
      timeout: 15000,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.data) {
      throw new Error("No data received from Cloudinary");
    }

    console.log("Successfully fetched Cloudinary data"); // ADD THIS
    return response.data;
  } catch (error) {
    // Better error logging:
    console.error("Cloudinary fetch error:", {
      url: cloudinaryUrl,
      error: error.message,
      status: error.response?.status,
    });

    if (error.response) {
      throw new Error(
        `Cloudinary error (${error.response.status}): ${error.response.statusText}`
      );
    } else if (error.request) {
      throw new Error(
        "No response from Cloudinary - check your internet connection"
      );
    } else {
      throw new Error(error.message || "Failed to fetch data from Cloudinary");
    }
  }
};

/**
 * Delete a resource from Cloudinary
 * Note: This requires backend implementation as it needs API secret
 */
const deleteResource = async (publicId, resourceType = "image") => {
  try {
    // This should call your backend API which handles Cloudinary deletion
    const response = await axios.post("/api/cloudinary/delete", {
      publicId,
      resourceType,
    });

    return response.data;
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error("Error deleting Cloudinary resource:", parsedError);
    throw parsedError;
  }
};

/**
 * Get Cloudinary image with transformations
 */
const getTransformedImageUrl = (publicId, transformations = {}) => {
  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = transformations;

  const baseUrl = `https://res.cloudinary.com/${apiUrls.cloudinary.cloud_name}/image/upload`;
  const transforms = [];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);
  if (quality) transforms.push(`q_${quality}`);
  if (format) transforms.push(`f_${format}`);

  const transformString = transforms.join(",");
  return `${baseUrl}/${transformString}/${publicId}`;
};

const cloudinaryService = {
  uploadImage,
  uploadRawData,
  fetchCloudinaryData,
  deleteResource,
  getTransformedImageUrl,
};

export { cloudinaryService };
export default cloudinaryService;
