// SavedTemplates.jsx - Complete Component with Full HTML Preview
// Updated: November 19, 2025 - Dynamic Full Width/Height Preview with Proper Scaling

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// Redux actions
import {
  fetchTemplates,
  deleteTemplate as deleteTemplateAction,
  duplicateTemplate as duplicateTemplateAction,
  setSearchQuery,
  selectTemplates,
  selectFilteredTemplates,
  selectTemplatesLoading,
  selectSearchQuery,
} from "../redux/slices/templateSlice";

import { loadTemplateIntoEditor } from "../redux/slices/editorSlice";
import { addNotification } from "../redux/slices/uiSlice";

export default function SavedTemplates() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for per-template loading
  const [deletingId, setDeletingId] = useState(null);
  const [duplicatingId, setDuplicatingId] = useState(null);

  // Redux state
  const templates = useSelector(selectTemplates);
  const filteredTemplates = useSelector(selectFilteredTemplates);
  const isLoading = useSelector(selectTemplatesLoading);
  const searchQuery = useSelector(selectSearchQuery);
  const error = useSelector((state) => state.template.templatesError);

  // Fetch templates on mount
  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  // Helper function to calculate iframe dimensions and scale
  const getIframeDimensions = (template) => {
    const maxWidth = template.globalSettings?.maxWidth || "600px";
    const minHeight = template.globalSettings?.minHeight || "1000px";

    // Parse dimensions (remove 'px' if present)
    const width = parseInt(maxWidth);
    const height = parseInt(minHeight);

    // Card container width for saved templates (approximately 280px per card)
    const containerWidth = 280;
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
  // DELETE TEMPLATE
  // ============================================================================
  const handleDelete = async (templateId) => {
    const templateToDelete = templates.find((t) => t._id === templateId);
    const templateName = templateToDelete?.name || "this template";

    if (
      !window.confirm(
        `Are you sure you want to delete "${templateName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(templateId);

    try {
      await dispatch(deleteTemplateAction(templateId)).unwrap();

      dispatch(
        addNotification({
          type: "success",
          message: `"${templateName}" deleted successfully`,
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          message: `Failed to delete: ${error.message}`,
        })
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================================================
  // DUPLICATE TEMPLATE
  // ============================================================================
  const handleDuplicate = async (template) => {
    const newName = `${template.name || "Template"} (Copy)`;

    setDuplicatingId(template._id);

    try {
      await dispatch(
        duplicateTemplateAction({
          name: newName,
          elements: template.elements,
          globalSettings: template.globalSettings,
          previewImageUrl: template.previewImageUrl,
        })
      ).unwrap();

      dispatch(
        addNotification({
          type: "success",
          message: `Template duplicated as "${newName}"`,
        })
      );
    } catch (err) {
      dispatch(
        addNotification({
          type: "error",
          message: `Failed to duplicate: ${err.message || err}`,
        })
      );
    } finally {
      setDuplicatingId(null);
    }
  };

  // ============================================================================
  // LOAD TEMPLATE FOR EDITING
  // ============================================================================
  const handleEdit = async (template) => {
    try {
      navigate("/", {
        state: {
          template: template,
          action: "edit",
        },
      });
    } catch (err) {
      dispatch(
        addNotification({
          type: "error",
          message: `Failed to load: ${err.message}`,
        })
      );
    }
  };

  // ============================================================================
  // LOAD TEMPLATE FOR SENDING
  // ============================================================================
  const handleSend = async (template) => {
    try {
      navigate("/", {
        state: {
          template: template,
          action: "send",
        },
      });
    } catch (err) {
      dispatch(
        addNotification({
          type: "error",
          message: `Failed to load: ${err.message}`,
        })
      );
    }
  };

  // ============================================================================
  // PREVIEW TEMPLATE (FULL VIEW)
  // ============================================================================
  const handlePreview = (template) => {
    if (template.emailHtml) {
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
  // RETRY FETCH
  // ============================================================================
  const handleRetry = () => {
    dispatch(fetchTemplates());
  };

  // ============================================================================
  // RENDER LOADING STATE
  // ============================================================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="px-6 py-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Saved Templates
            </h1>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              + New Template
            </Link>
          </div>

          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading templates...
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Saved Templates
            </h1>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              + New Template
            </Link>
          </div>

          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <svg
                className="w-8 h-8 text-red-600"
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
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Failed to Load Templates
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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

      <div className="py-6 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black mt-10 mb-2 bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] bg-clip-text text-transparent tracking-tight">
              Saved Templates
            </h1>
            <p className="text-gray-600 font-medium">
              {templates.length}{" "}
              {templates.length === 1 ? "template" : "templates"} saved
            </p>
          </div>
          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-l from-[#f51398] to-[#2001fd] text-white hover:brightness-110 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Template
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl group">
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
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder="Search templates..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white shadow-md outline-none border-2 border-gray-200 placeholder-gray-400 text-gray-800 font-medium focus:ring-2 focus:ring-offset-2 focus:border-transparent focus:ring-[#f51398] focus:ring-offset-[#2001fd] group-hover:border-[#f51398] transition-all duration-300"
            />
          </div>
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
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
              {searchQuery ? "No templates found" : "No templates yet"}
            </h2>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first newsletter template to get started"}
            </p>
            {!searchQuery && (
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] text-white hover:brightness-110 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Template
              </Link>
            )}
          </div>
        )}

        {/* Templates Grid */}
        {filteredTemplates.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTemplates.map((template) => {
              const iframeDims = getIframeDimensions(template);

              return (
                <div
                  key={template._id}
                  className="group bg-white rounded-2xl border-2 border-gray-200 shadow-md hover:shadow-2xl hover:border-transparent transition-all duration-300 overflow-hidden flex flex-col hover:scale-[1.02]"
                >
                  {/* Template Preview - HTML Rendering */}
                  <div className="relative h-80 bg-gray-100 overflow-y-auto overflow-x-hidden hide-scrollbar preview-container">
                    {template.emailHtml ? (
                      // Render HTML template scaled to fit card width
                      <div
                        className="w-full flex justify-center bg-gray-100"
                        style={{
                          minHeight: "320px",
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
                              className="border-0 pointer-events-none shadow-sm"
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
                    ) : (
                      // No HTML available
                      <div className="w-full h-full flex flex-col items-center justify-center p-4">
                        <svg
                          className="w-16 h-16 text-gray-300 mb-3"
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
                        <p className="text-sm text-gray-400 text-center">
                          No preview available
                        </p>
                      </div>
                    )}

                    {/* Hover Overlay with Preview Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/10">
                      <button
                        onClick={() => handlePreview(template)}
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

                  {/* Template Info */}
                  <div className="p-5 space-y-3 flex-shrink-0">
                    <h3 className="text-base font-extrabold truncate bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] bg-clip-text text-transparent">
                      {template.name || "Untitled Template"}
                    </h3>

                    <p className="text-xs font-medium text-gray-500">
                      {template.updatedAt
                        ? new Date(template.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "No date"}
                    </p>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleEdit(template)}
                        className="px-2 py-2 text-xs font-bold text-white rounded-lg bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] hover:brightness-110 hover:scale-[1.05] shadow-md transition-all flex items-center justify-center gap-1"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>

                      <button
                        onClick={() => handleSend(template)}
                        className="px-2 py-2 text-xs font-bold text-white rounded-lg bg-gradient-to-r from-indigo-500 to-blue-600 hover:brightness-110 hover:scale-[1.05] shadow-md transition-all flex items-center justify-center gap-1"
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
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                        Send
                      </button>

                      <button
                        onClick={() => handleDuplicate(template)}
                        disabled={duplicatingId === template._id}
                        className="px-2 py-2 text-xs font-bold text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:brightness-110 hover:scale-[1.05] shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                      >
                        {duplicatingId === template._id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                          <>
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
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Duplicate
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(template._id)}
                        disabled={deletingId === template._id}
                        className="px-2 py-2 text-xs font-bold text-white rounded-lg bg-gradient-to-r from-red-500 to-red-700 hover:brightness-110 hover:scale-[1.05] shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                      >
                        {deletingId === template._id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                          <>
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
