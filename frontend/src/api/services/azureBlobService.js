/**
 * Azure Blob Storage Service - FRONTEND ONLY
 * Handles file uploads to Azure Blob Storage (replaces cloudinaryService.js)
 * 
 * USAGE: Replace your cloudinaryService.js imports with this file
 */

import axios from "axios";
import apiUrls from "../config/apiUrls";
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
 * Upload an image to Azure Blob Storage
 * This replaces uploadImage from cloudinaryService.js
 */
const uploadImage = async (imageBlob, blobName = null, options = {}) => {
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

    // Generate unique blob name if not provided
    if (!blobName) {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const extension = imageBlob.type.split("/")[1] || "jpg";
      blobName = `images/${timestamp}_${randomStr}.${extension}`;
    }

    // Add folder prefix if specified
    if (options.folder) {
      blobName = `${options.folder}/${blobName}`;
    }

    // Step 1: Get SAS token from your backend
    const sasResponse = await axios.post(
      `${apiUrls.base_url}${apiUrls.azure.generateSASToken}`,
      {
        blobName,
        containerName: options.container || apiUrls.azure.container_name,
        permissions: "cw", // create and write
      }
    );

    const { sasToken, blobUrl } = sasResponse.data;

    // Step 2: Upload directly to Azure using SAS token
    const uploadUrl = `${blobUrl}?${sasToken}`;

    await axios.put(uploadUrl, imageBlob, {
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": imageBlob.type,
      },
      onUploadProgress: options.onProgress,
    });

    // Return data in similar format to Cloudinary for compatibility
    return {
      success: true,
      secure_url: blobUrl,
      public_id: blobName, // Similar to Cloudinary's public_id
      blob_name: blobName,
      width: options.width || null,
      height: options.height || null,
      format: imageBlob.type.split("/")[1],
      resource_type: "image",
      created_at: new Date().toISOString(),
    };
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error("Error uploading image to Azure:", parsedError);
    throw {
      success: false,
      message: parsedError.message || "Failed to upload image",
      error: parsedError,
    };
  }
};

/**
 * Upload raw data (JSON or HTML) to Azure Blob Storage
 * This replaces uploadRawData from cloudinaryService.js
 */
const uploadRawData = async (data, blobName = null, options = {}) => {
  try {
    const isHTML = options.contentType === "text/html";
    const contentType = isHTML ? "text/html" : "application/json";
    const content = isHTML ? data : JSON.stringify(data);

    const blob = new Blob([content], { type: contentType });

    // Generate unique blob name if not provided
    if (!blobName) {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const extension = isHTML ? "html" : "json";
      blobName = `data/${timestamp}_${randomStr}.${extension}`;
    }

    // Add folder prefix if specified
    if (options.folder) {
      blobName = `${options.folder}/${blobName}`;
    }

    // Step 1: Get SAS token from your backend
    const sasResponse = await axios.post(
      `${apiUrls.base_url}${apiUrls.azure.generateSASToken}`,
      {
        blobName,
        containerName: options.container || apiUrls.azure.container_name,
        permissions: "cw",
      }
    );

    const { sasToken, blobUrl } = sasResponse.data;

    // Step 2: Upload to Azure
    const uploadUrl = `${blobUrl}?${sasToken}`;

    await axios.put(uploadUrl, blob, {
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": contentType,
      },
      onUploadProgress: options.onProgress,
    });

    return {
      success: true,
      secure_url: blobUrl,
      public_id: blobName,
      blob_name: blobName,
      resource_type: isHTML ? "html" : "raw",
      created_at: new Date().toISOString(),
    };
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error("Error uploading raw data to Azure:", parsedError);
    throw {
      success: false,
      message: parsedError.message || "Failed to upload data",
      error: parsedError,
    };
  }
};

/**
 * Fetch data from Azure Blob Storage URL
 * This replaces fetchCloudinaryData from cloudinaryService.js
 */
const fetchAzureData = async (blobUrl) => {
  try {
    if (!blobUrl) {
      throw new Error("Blob URL is required");
    }

    console.log("Fetching from Azure:", blobUrl);

    const response = await axios.get(blobUrl, {
      timeout: 15000,
      headers: {
        Accept: "application/json, text/html",
      },
    });

    if (!response.data) {
      throw new Error("No data received from Azure");
    }

    console.log("Successfully fetched Azure data");

    return response.data;
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error("Error fetching data from Azure:", parsedError);
    throw {
      success: false,
      message: parsedError.message || "Failed to fetch data from Azure",
      error: parsedError,
    };
  }
};

/**
 * Delete a blob from Azure Blob Storage
 */
const deleteBlob = async (blobName, containerName = null) => {
  try {
    const response = await axios.delete(
      `${apiUrls.base_url}${apiUrls.azure.deleteBlob}`,
      {
        data: {
          blobName,
          containerName: containerName || apiUrls.azure.container_name,
        },
      }
    );

    return {
      success: true,
      message: "Blob deleted successfully",
    };
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error("Error deleting blob from Azure:", parsedError);
    throw {
      success: false,
      message: parsedError.message || "Failed to delete blob",
      error: parsedError,
    };
  }
};

// Export with same structure as cloudinaryService for easy replacement
const azureBlobService = {
  uploadImage,
  uploadRawData,
  fetchAzureData,
  deleteBlob,
};

export default azureBlobService;

// Named exports for compatibility
export { uploadImage, uploadRawData, fetchAzureData, deleteBlob };
