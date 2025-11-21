/**
 * Azure Blob Storage Service - BACKEND PROXY VERSION
 * All operations go through backend API
 * 
 * src/api/services/azureBlobService.js
 */

import axios from "axios";
import apiUrls from "../config/apiUrls";
import { parseApiError, validateFileType, validateFileSize } from "../utils/requestHelper";

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
 * Upload an image to Azure Blob Storage via backend
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
          `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`
        );
      }
    }

    // Create FormData to send file to backend
    const formData = new FormData();
    formData.append("file", imageBlob);
    formData.append("blobName", blobName || "");
    formData.append("folder", options.folder || "");
    formData.append("container", options.container || "templates");

    // Send to backend
    const response = await axios.post(
      `${apiUrls.base_url}/azure/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: options.onProgress,
      }
    );

    // Return in Cloudinary-compatible format
    return {
      success: true,
      secure_url: response.data.url,
      public_id: response.data.blobName,
      blob_name: response.data.blobName,
      width: response.data.width || null,
      height: response.data.height || null,
      format: response.data.format,
      resource_type: "image",
      created_at: response.data.createdAt,
    };
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error("Error uploading image:", parsedError);
    throw {
      success: false,
      message: parsedError.message || "Failed to upload image",
      error: parsedError,
    };
  }
};

/**
 * Upload raw data (JSON or HTML) to Azure via backend
 */
const uploadRawData = async (data, blobName = null, options = {}) => {
  try {
    const isHTML = options.contentType === "text/html";
    const contentType = isHTML ? "text/html" : "application/json";

    // Send to backend
    const response = await axios.post(
      `${apiUrls.base_url}/azure/upload-data`,
      {
        data: data,
        blobName: blobName || "",
        folder: options.folder || "",
        container: options.container || "templates",
        contentType: contentType,
      },
      {
        onUploadProgress: options.onProgress,
      }
    );

    return {
      success: true,
      secure_url: response.data.url,
      public_id: response.data.blobName,
      blob_name: response.data.blobName,
      resource_type: isHTML ? "html" : "raw",
      created_at: response.data.createdAt,
    };
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error("Error uploading raw data:", parsedError);
    throw {
      success: false,
      message: parsedError.message || "Failed to upload data",
      error: parsedError,
    };
  }
};

/**
 * Fetch data from Azure via backend
 */
const fetchAzureData = async (blobUrl) => {
  try {
    if (!blobUrl) {
      throw new Error("Blob URL is required");
    }

    console.log("Fetching from Azure via backend:", blobUrl);

    const response = await axios.post(
      `${apiUrls.base_url}/azure/fetch-data`,
      {
        blobUrl: blobUrl,
      },
      {
        timeout: 15000,
      }
    );

    if (!response.data) {
      throw new Error("No data received");
    }

    console.log("Successfully fetched Azure data");
    return response.data;
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error("Error fetching data:", parsedError);
    throw {
      success: false,
      message: parsedError.message || "Failed to fetch data",
      error: parsedError,
    };
  }
};

/**
 * Delete a blob from Azure via backend
 */
const deleteBlob = async (blobName, containerName = null) => {
  try {
    const response = await axios.delete(
      `${apiUrls.base_url}/azure/delete-blob`,
      {
        data: {
          blobName: blobName,
          containerName: containerName || "templates",
        },
      }
    );

    return {
      success: true,
      message: "Blob deleted successfully",
    };
  } catch (error) {
    const parsedError = parseApiError(error);
    console.error("Error deleting blob:", parsedError);
    throw {
      success: false,
      message: parsedError.message || "Failed to delete blob",
      error: parsedError,
    };
  }
};

// Export service
const azureBlobService = {
  uploadImage,
  uploadRawData,
  fetchAzureData,
  deleteBlob,
};

export default azureBlobService;

// Named exports
export { uploadImage, uploadRawData, fetchAzureData, deleteBlob };