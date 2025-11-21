/**
 * Custom React Hook for Image Upload to Cloudinary
 */

import { useState, useCallback } from "react";
import {
  uploadImageToCloudinary,
  uploadMultipleImages,
  validateImageFile,
  compressImage,
} from "../utils/imageUtils";

/**
 * Custom hook for handling image uploads to Cloudinary
 * @param {Object} options - Configuration options
 * @returns {Object} - Upload state and functions
 */
export const useImageUpload = (options = {}) => {
  const {
    onSuccess = null,
    onError = null,
    maxSizeMB = 10,
    compress = false,
    maxWidth = 1920,
    quality = 0.9,
  } = options;

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  /**
   * Upload a single image
   */
  const uploadImage = useCallback(
    async (file) => {
      try {
        // Reset state
        setUploading(true);
        setProgress(0);
        setError(null);
        setUploadedUrl(null);

        // Validate file
        const validation = validateImageFile(file, maxSizeMB);
        if (!validation.valid) {
          throw new Error(validation.error);
        }

        // Compress if needed
        let fileToUpload = file;
        if (compress) {
          setProgress(10);
          const compressed = await compressImage(file, maxWidth, quality);
          // Convert base64 back to File
          const blob = await fetch(compressed).then((r) => r.blob());
          fileToUpload = new File([blob], file.name, { type: "image/jpeg" });
          setProgress(20);
        }

        // Upload to Cloudinary
        const url = await uploadImageToCloudinary(fileToUpload, setProgress);

        // Success
        setUploadedUrl(url);
        if (onSuccess) onSuccess(url);

        return url;
      } catch (err) {
        console.error("Image upload error:", err);
        const errorMessage = err.message || "Failed to upload image";
        setError(errorMessage);
        if (onError) onError(err);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [onSuccess, onError, maxSizeMB, compress, maxWidth, quality]
  );

  /**
   * Upload multiple images
   */
  const uploadImages = useCallback(
    async (files) => {
      try {
        setUploading(true);
        setProgress(0);
        setError(null);

        // Validate all files
        for (const file of files) {
          const validation = validateImageFile(file, maxSizeMB);
          if (!validation.valid) {
            throw new Error(`${file.name}: ${validation.error}`);
          }
        }

        // Upload all files
        const urls = await uploadMultipleImages(files, setProgress);

        if (onSuccess) onSuccess(urls);
        return urls;
      } catch (err) {
        console.error("Multiple images upload error:", err);
        const errorMessage = err.message || "Failed to upload images";
        setError(errorMessage);
        if (onError) onError(err);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [onSuccess, onError, maxSizeMB]
  );

  /**
   * Reset upload state
   */
  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
    setUploadedUrl(null);
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadedUrl,
    uploadImage,
    uploadImages,
    reset,
  };
};

export default useImageUpload;