/**
 * ImageUpload Component with Cloudinary Integration
 * Features: Drag & drop, file picker, progress indicator, preview
 */

import React, { useState, useRef } from "react";
import { useImageUpload } from "../hooks/useImageUpload";
import { Upload, X, Check, AlertCircle } from "lucide-react";

const ImageUpload = ({
  onImageUploaded,
  currentImage = null,
  buttonText = "Upload Image",
  className = "",
  showPreview = true,
  compress = false,
  maxSizeMB = 10,
}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentImage);

  const { uploading, progress, error, uploadImage, reset } = useImageUpload({
    onSuccess: (url) => {
      setPreview(url);
      if (onImageUploaded) onImageUploaded(url);
    },
    maxSizeMB,
    compress,
  });

  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadImage(file);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      await uploadImage(file);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Remove image
  const handleRemove = () => {
    setPreview(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onImageUploaded) onImageUploaded(null);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-6
          transition-all duration-300 cursor-pointer
          ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${uploading ? "pointer-events-none opacity-50" : ""}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload UI */}
        <div className="flex flex-col items-center justify-center space-y-3">
          {uploading ? (
            <>
              {/* Progress */}
              <div className="w-full max-w-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Uploading to Cloudinary...
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400" />
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">
                  {buttonText}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF, WebP up to {maxSizeMB}MB
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={reset}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Preview */}
      {showPreview && preview && !uploading && (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          
          {/* Success indicator */}
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium">
            <Check className="w-3 h-3" />
            Uploaded to Cloudinary
          </div>

          {/* Remove button */}
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200
                     hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Cloudinary URL */}
          <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
            <p className="text-xs text-gray-500 mb-1 font-medium">
              Cloudinary URL:
            </p>
            <p className="text-xs text-gray-700 break-all font-mono">
              {preview}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;