// SavedTemplates.jsx - FIXED VERSION WITH LIVE UPDATES

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// Redux actions
import {
  fetchTemplates,
  deleteTemplate,
  duplicateTemplate,
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

    setDeletingId(templateId); // Set loading for THIS template only

    try {
      await dispatch(deleteTemplate(templateId)).unwrap();

      // Template is already removed from Redux by the reducer
      // No need to refetch - it updates live!

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
      setDeletingId(null); // Clear loading state
    }
  };

  // ============================================================================
  // DUPLICATE TEMPLATE
  // ============================================================================
  const handleDuplicate = async (template) => {
    const newName = `${template.name || "Template"} (Copy)`;

    setDuplicatingId(template._id); // Set loading for THIS template only

    try {
      await dispatch(duplicateTemplate({ template, newName })).unwrap();

      // New template is already added to Redux by the reducer
      // It appears live in the grid!

      dispatch(
        addNotification({
          type: "success",
          message: `Template duplicated as "${newName}"`,
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          message: `Failed to duplicate: ${error.message}`,
        })
      );
    } finally {
      setDuplicatingId(null); // Clear loading state
    }
  };

  // ============================================================================
  // LOAD TEMPLATE FOR EDITING
  // ============================================================================
  const handleEdit = async (template) => {
    try {
      await dispatch(
        loadTemplateIntoEditor({
          templateId: template._id || template.id,
        })
      ).unwrap();
      navigate("/");
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          message: error?.message || "Failed to load template",
        })
      );
    }
  };

  // ============================================================================
  // LOAD TEMPLATE FOR SENDING
  // ============================================================================
  const handleSend = async (template) => {
    try {
      await dispatch(
        loadTemplateIntoEditor({
          templateId: template._id,
          action: "send",
        })
      ).unwrap();
      navigate("/");
    } catch (error) {
      dispatch(
        addNotification({
          type: "error",
          message: `Failed to load template: ${error.message}`,
        })
      );
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
          {/* Header */}
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

          {/* Loading Skeleton */}
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
    <div className="min-h-screen">
      <div className="py-6 max-w-400 mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-4xl font-extrabold mt-10 mb-2 
bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd]
bg-clip-text text-transparent tracking-tight"
            >
              Saved Templates
            </h1>
            <p className="text-gray-600">
              {templates.length}{" "}
              {templates.length === 1 ? "template" : "templates"} saved
            </p>
          </div>
          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-l from-[#f51398] to-[#2001fd] text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
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
        <div className="mb-6">
          <div className="relative max-w-md group">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 
      text-gray-400 group-focus-within:text-[#f51398] transition-colors duration-300"
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
              className="w-full pl-12 pr-4 py-3 rounded-xl 
      bg-white shadow-md outline-none border-2 border-gray-200
      placeholder-gray-400 text-gray-800 font-medium
      focus:ring-2 focus:ring-offset-2 focus:border-transparent
      focus:ring-[#f51398] focus:ring-offset-[#2001fd] 
      group-hover:border-[#f51398] transition-all duration-300"
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
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
            {filteredTemplates.map((template) => (
              <div
                key={template._id}
                className="group bg-white rounded-2xl border-2 border-black shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Template Preview Image */}
                <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden group border-2 border-black shadow-inner">
                  {template.previewImageUrl ? (
                    <div className="w-full flex justify-center items-start overflow-hidden group-hover:overflow-y-auto scrollbar-hide">
                      <img
                        src={template.previewImageUrl}
                        alt={template.name}
                        className="w-[600px] object-contain pointer-events-none"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-gray-400"
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
                </div>

                {/* Template Info */}
                <div className="p-5 space-y-3">
                  <h3
                    className="text-base font-extrabold truncate 
          bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd] 
          bg-clip-text text-transparent"
                  >
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
                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(template)}
                      className="px-2 py-2 text-xs font-bold text-white rounded-lg
              bg-gradient-to-r from-[#f51398] via-[#c40cd8] to-[#2001fd]
              hover:brightness-110 hover:scale-[1.05] shadow-md transition-all"
                    >
                      Edit
                    </button>

                    {/* Send */}
                    <button
                      onClick={() => handleSend(template)}
                      className="px-2 py-2 text-xs font-bold text-white rounded-lg
              bg-gradient-to-r from-indigo-500 to-blue-600
              hover:brightness-110 hover:scale-[1.05] shadow-md transition-all"
                    >
                      Send
                    </button>

                    {/* Duplicate - Only THIS button shows loading */}
                    <button
                      onClick={() => handleDuplicate(template)}
                      disabled={duplicatingId === template._id}
                      className="px-2 py-2 text-xs font-bold text-white rounded-lg
              bg-gradient-to-r from-blue-500 to-blue-700
              hover:brightness-110 hover:scale-[1.05] shadow-md transition-all
              disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {duplicatingId === template._id ? "..." : "Duplicate"}
                    </button>

                    {/* Delete - Only THIS button shows loading */}
                    <button
                      onClick={() => handleDelete(template._id)}
                      disabled={deletingId === template._id}
                      className="px-2 py-2 text-xs font-bold text-white rounded-lg
              bg-gradient-to-r from-red-500 to-red-700
              hover:brightness-110 hover:scale-[1.05] shadow-md transition-all
              disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {deletingId === template._id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
