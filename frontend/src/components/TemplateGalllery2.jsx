// TemplateGallery.jsx - Complete Component with Full HTML Preview
// Updated: November 19, 2025 - Dynamic Full Width/Height Preview

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Redux imports
import {
  fetchPublicTemplates,
  setPublicSearchQuery,
  setSelectedCategory,
  selectPublicTemplates,
  selectPublicTemplatesLoading,
  selectPublicSearchQuery,
  selectSelectedCategory,
  selectFilteredPublicTemplates,
} from "../redux/slices/templateSlice";

import {
  setElements,
  setGlobalSettings,
  setNewsletterName,
  setCurrentTemplateId,
  resetEditor,
} from "../redux/slices/editorSlice";

import { addNotification } from "../redux/slices/uiSlice";

export default function TemplateGallery() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const templates = useSelector(selectPublicTemplates);
  const filteredTemplates = useSelector(selectFilteredPublicTemplates);
  const loading = useSelector(selectPublicTemplatesLoading);
  const searchQuery = useSelector(selectPublicSearchQuery);
  const selectedCategory = useSelector(selectSelectedCategory);
  const error = useSelector((state) => state.template.publicTemplatesError);

  // Local state for loading individual templates
  const [loadingTemplateId, setLoadingTemplateId] = useState(null);

  // Categories for filtering
  const categories = [
    { id: "all", label: "All Templates" },
    { id: "Real Estate", label: "Real Estate" },
    { id: "Financial Services", label: "Financial Services" },
    { id: "Healthcare & Wellness", label: "Healthcare & Wellness" },
    { id: "Education & Training", label: "Education & Training" },
    { id: "Retail & E-commerce", label: "Retail & E-commerce" },
    { id: "Travel & Hospitality", label: "Travel & Hospitality" },
    { id: "Technology & SaaS", label: "Technology & SaaS" },
    { id: " ", label: "Media & Entertainment" },
    { id: "Automotive", label: "Automotive" },
    { id: "Professional Services", label: "Professional Services" },
  ];

  // Fetch templates on mount
  useEffect(() => {
    dispatch(fetchPublicTemplates());
  }, [dispatch]);

  // Group templates by category for section rendering
  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    const cat = template.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(template);
    return acc;
  }, {});

  // Helper function to calculate iframe dimensions and scale for card preview
  const getIframeDimensions = (template) => {
    const maxWidth = template.globalSettings?.maxWidth || "600px";
    const minHeight = template.globalSettings?.minHeight || "1000px";

    // Parse dimensions (remove 'px' if present)
    const width = parseInt(maxWidth);
    const height = parseInt(minHeight);

    // Card container is approximately 300px wide
    const containerWidth = 300;
    const scale = containerWidth / width;

    // Calculate the actual displayed height after scaling
    const displayHeight = height * scale;

    return {
      width: width,
      height: height,
      scale: scale,
      displayHeight: displayHeight,
      containerWidth: containerWidth,
    };
  };

  // ============================================================================
  // USE TEMPLATE (LOAD INTO EDITOR)
  // ============================================================================
  const handleUseTemplate = async (template) => {
    try {
      setLoadingTemplateId(template._id);

      // Reset editor first
      dispatch(resetEditor());

      // Load template data into editor Redux state
      dispatch(setElements(template.elements || []));
      dispatch(
        setGlobalSettings(
          template.globalSettings || {
            maxWidth: "600px",
            minHeight: "800px",
            backgroundColor: "#f5f5f5",
            newsletterColor: "#ffffff",
            fontFamily: "Arial, sans-serif",
          }
        )
      );
      dispatch(setNewsletterName(`${template.name} (Copy)`));
      dispatch(setCurrentTemplateId(null)); // New template, not an update

      // Navigate to editor
      navigate("/");

      dispatch(
        addNotification({
          type: "success",
          message: `Template "${template.name}" loaded successfully`,
        })
      );
    } catch (err) {
      dispatch(
        addNotification({
          type: "error",
          message: `Failed to load template: ${err.message}`,
        })
      );
    } finally {
      setLoadingTemplateId(null);
    }
  };

  // ============================================================================
  // PREVIEW TEMPLATE
  // ============================================================================
  const handlePreviewTemplate = (template) => {
    if (template.emailHtml) {
      // Open HTML in new window
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(template.emailHtml);
        newWindow.document.close();
      }
    } else if (template.previewImageUrl) {
      window.open(template.previewImageUrl, "_blank");
    }
  };

  // ============================================================================
  // RETRY HANDLER
  // ============================================================================
  const handleRetry = () => {
    dispatch(fetchPublicTemplates());
  };

  // ============================================================================
  // CLEAR FILTERS
  // ============================================================================
  const handleClearFilters = () => {
    dispatch(setPublicSearchQuery(""));
    dispatch(setSelectedCategory("all"));
  };

  // ============================================================================
  // RENDER LOADING STATE
  // ============================================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <p className="mt-6 text-gray-600 font-medium text-lg">
              Loading template gallery...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER ERROR STATE
  // ============================================================================
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Failed to Load Template Gallery
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>
            <button
              onClick={handleRetry}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER MAIN CONTENT
  // ============================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Add global style to hide scrollbars and enable smooth scrolling */}
      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        /* Smooth scroll for preview containers */
        .preview-container {
          scroll-behavior: smooth;
        }
      `}</style>

      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-black mb-3 bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] bg-clip-text text-transparent tracking-tight leading-tight">
            Template Gallery
          </h1>
          <p className="mt-6 text-xl font-medium text-gray-600 max-w-2xl mx-auto">
            Choose from {templates.length} professionally designed templates
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-16 pb-8 border-b border-gray-200 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto group">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#f51398] transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setPublicSearchQuery(e.target.value))}
              placeholder="Search templates..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white shadow-md outline-none border-2 border-gray-200 placeholder-gray-400 text-gray-800 font-medium focus:ring-2 focus:ring-offset-2 focus:border-transparent focus:ring-[#f51398] focus:ring-offset-[#2001fd] group-hover:border-[#f51398] transition-all duration-300"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => dispatch(setSelectedCategory(category.id))}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] text-white shadow-[0_4px_20px_rgba(196,12,216,0.4)] scale-105"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#c40cd8] hover:scale-105 hover:shadow-md"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {(searchQuery || selectedCategory !== "all") && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600 font-medium">
              Found {filteredTemplates.length}{" "}
              {filteredTemplates.length === 1 ? "template" : "templates"}
            </p>
            <button
              onClick={handleClearFilters}
              className="text-sm text-[#f51398] hover:text-[#c40cd8] font-semibold flex items-center gap-1 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear Filters
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No templates found
            </h2>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Templates Grouped by Category Sections */}
        {filteredTemplates.length > 0 && (
          <>
            {Object.entries(groupedTemplates).map(
              ([category, categoryTemplates]) => (
                <section key={category} className="mb-20">
                  {/* Category Header */}
                  <div className="mb-8">
                    <h2 className="text-3xl sm:text-4xl font-black mb-2 bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] bg-clip-text text-transparent inline-block">
                      {category}
                    </h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] rounded-full mt-2"></div>
                  </div>

                  {/* Template Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryTemplates.map((template) => {
                      const iframeDims = getIframeDimensions(template);

                      return (
                        <div
                          key={template._id}
                          className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm transition-all duration-500 ease-in-out relative hover:shadow-[0_8px_40px_rgba(245,19,152,0.25),0_0_60px_rgba(196,12,216,0.15)] hover:z-20 hover:scale-[1.02] hover:border-transparent flex flex-col"
                        >
                          {/* Title - Always visible at top */}
                          <div className="p-5 bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] relative overflow-hidden flex-shrink-0">
                            <h3 className="text-lg font-bold text-white text-center tracking-tight leading-tight relative z-10">
                              {template.name || "Untitled Template"}
                            </h3>
                          </div>

                          {/* Template Preview - Render Full HTML with Proper Scaling */}
                          <div
                            className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-100 relative hide-scrollbar preview-container"
                            style={{ maxHeight: "500px" }}
                          >
                            {template.emailHtml ? (
                              // Render HTML template scaled to fit card width while maintaining aspect ratio
                              <div
                                className="w-full flex justify-center bg-gray-100"
                                style={{
                                  minHeight: "400px",
                                }}
                              >
                                <div
                                  className="relative"
                                  style={{
                                    width: "100%",
                                    maxWidth: `${iframeDims.containerWidth}px`,
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${iframeDims.width}px`,
                                      height: `${iframeDims.height}px`,
                                      transform: `scale(${iframeDims.scale})`,
                                      transformOrigin: "top left",
                                      margin: "0 auto",
                                    }}
                                  >
                                    <iframe
                                      srcDoc={template.emailHtml}
                                      title={template.name}
                                      className="border-0 pointer-events-none shadow-lg"
                                      style={{
                                        width: `${iframeDims.width}px`,
                                        height: `${iframeDims.height}px`,
                                        border: "none",
                                        display: "block",
                                        backgroundColor: "white",
                                      }}
                                      sandbox="allow-same-origin"
                                      scrolling="no"
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : template.previewImageUrl ? (
                              // Fallback to image if no HTML
                              <img
                                src={template.previewImageUrl}
                                alt={template.name}
                                className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
                              />
                            ) : (
                              // No preview available
                              <div className="w-full h-full flex items-center justify-center min-h-[400px]">
                                <svg
                                  className="w-16 h-16 text-gray-300"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </div>
                            )}

                            {/* Hover Overlay with Preview Button */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/10">
                              <button
                                onClick={() => handlePreviewTemplate(template)}
                                className="px-5 py-2.5 bg-white text-gray-800 rounded-lg font-semibold shadow-xl transform scale-90 hover:scale-100 transition-all duration-200 flex items-center gap-2 pointer-events-auto hover:bg-gradient-to-r hover:from-[#f51398] hover:via-[#c40cd8] hover:to-[#2001fd] hover:text-white"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                Full Preview
                              </button>
                            </div>
                          </div>

                          {/* Template Info - Always visible at bottom */}
                          <div className="p-5 flex-shrink-0 border-t border-gray-100">
                            {template.description && (
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {template.description}
                              </p>
                            )}

                            {/* Use Template Button */}
                            <button
                              onClick={() => handleUseTemplate(template)}
                              disabled={loadingTemplateId === template._id}
                              className="w-full px-4 py-3 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] hover:brightness-110 hover:scale-[1.02] shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              {loadingTemplateId === template._id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  Loading...
                                </>
                              ) : (
                                <>
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  Use Template
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )
            )}
          </>
        )}

        {/* Footer */}
        {filteredTemplates.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              All templates are professionally designed and ready to use
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
