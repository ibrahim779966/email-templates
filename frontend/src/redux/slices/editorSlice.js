import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { templateService } from "../../api/services/templateService";
import { cloudinaryService } from "../../api/services/cloudinaryService";
import { getWorkId } from "../../api/utils/storageHelper";

// ============================================================================
// ASYNC THUNKS FOR EDITOR OPERATIONS
// ============================================================================

/**
 * Save or update the current newsletter
 */
export const saveNewsletter = createAsyncThunk(
  "editor/saveNewsletter",
  async ({ generateThumbnail }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { elements, globalSettings, newsletterName, currentTemplateId } =
        state.editor;

      // Generate thumbnail
      let thumbnailUrl = null;
      if (generateThumbnail) {
        const thumbnailDataUrl = await generateThumbnail();
        if (thumbnailDataUrl) {
          const blob = await fetch(thumbnailDataUrl).then((r) => r.blob());
          const thumbData = await cloudinaryService.uploadImage(blob);
          thumbnailUrl = thumbData.secure_url;
        }
      }

      // Upload template data to Cloudinary
      const templateData = {
        name: newsletterName || "Untitled",
        elements,
        globalSettings,
        workId: getWorkId(),
        createdAt: currentTemplateId ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const publicId = `newsletter-${Date.now()}`;
      const cloudinaryData = await cloudinaryService.uploadRawData(
        templateData,
        publicId
      );

      // Create or update in database
      let response;
      if (currentTemplateId) {
        const updates = {
          name: newsletterName || "Untitled",
          cloudinaryUrl: cloudinaryData.secure_url,
        };
        if (thumbnailUrl) {
          updates.previewImageUrl = thumbnailUrl;
        }
        response = await templateService.updateTemplate(
          currentTemplateId,
          updates
        );
      } else {
        response = await templateService.createTemplate({
          name: newsletterName || "Untitled",
          cloudinaryUrl: cloudinaryData.secure_url,
          previewImageUrl: thumbnailUrl,
        });
      }

      return response.data || response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Load a template into the editor
 */
export const loadTemplateIntoEditor = createAsyncThunk(
  "editor/loadTemplate",
  async ({ templateId, cloudinaryUrl }, { rejectWithValue }) => {
    try {
      let templateData;

      if (cloudinaryUrl) {
        templateData = await cloudinaryService.fetchCloudinaryData(
          cloudinaryUrl
        );
      } else if (templateId) {
        const template = await templateService.getTemplateById(templateId);

        // ADD THIS CHECK:
        if (!template || !template.cloudinaryUrl) {
          throw new Error("Template not found or missing Cloudinary URL");
        }

        templateData = await cloudinaryService.fetchCloudinaryData(
          template.cloudinaryUrl
        );
        templateData._id = template._id || template.id;
      } else {
        throw new Error("Either templateId or cloudinaryUrl is required");
      }

      // ADD THIS VALIDATION:
      if (!templateData || !templateData.elements) {
        throw new Error("Invalid template data - missing elements");
      }

      return templateData;
    } catch (error) {
      console.error("Error loading template:", error);
      return rejectWithValue({
        message: error.message || "Failed to load template",
        code: error.code,
        status: error.status,
      });
    }
  }
);

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState = {
  // Newsletter content
  elements: [
    {
      id: "header-1",
      type: "header",
      content: "Welcome to Our Newsletter",
      styles: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "#1a1a1a",
        textAlign: "center",
        padding: "20px",
        backgroundColor: "transparent",
        width: "100%",
        position: "static",
        fontFamily: "Arial, sans-serif",
      },
    },
  ],

  // Selection
  selectedElementId: null,

  // Global settings
  globalSettings: {
    backgroundColor: "#f5f5f5",
    maxWidth: "600px",
    fontFamily: "Arial, sans-serif",
    newsletterColor: "#FFFFFF",
    minHeight: "800px",
  },

  // Newsletter metadata
  newsletterName: "Untitled Newsletter",
  currentTemplateId: null,

  // View state
  activeView: "editor", // 'editor' | 'preview'

  // Save state
  saving: false,
  saveError: null,
  lastSaved: null,

  // Load state
  loading: false,
  loadError: null,

  // Dirty flag (has unsaved changes)
  isDirty: false,
};

// ============================================================================
// SLICE
// ============================================================================

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    // ========================================================================
    // ELEMENTS MANAGEMENT
    // ========================================================================
    setElements: (state, action) => {
      state.elements = action.payload;
      state.isDirty = true;
    },

    addElement: (state, action) => {
      state.elements.push(action.payload);
      state.isDirty = true;
    },

    updateElement: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.elements.findIndex((el) => el.id === id);
      if (index !== -1) {
        state.elements[index] = { ...state.elements[index], ...updates };
        state.isDirty = true;
      }
    },

    deleteElement: (state, action) => {
      state.elements = state.elements.filter((el) => el.id !== action.payload);
      if (state.selectedElementId === action.payload) {
        state.selectedElementId = null;
      }
      state.isDirty = true;
    },

    duplicateElement: (state, action) => {
      const elementToDuplicate = state.elements.find(
        (el) => el.id === action.payload
      );
      if (elementToDuplicate) {
        const newElement = {
          ...elementToDuplicate,
          id: `${elementToDuplicate.type}-${Date.now()}`,
          styles: {
            ...elementToDuplicate.styles,
            top: `${parseFloat(elementToDuplicate.styles.top || 0) + 20}px`,
            left: `${parseFloat(elementToDuplicate.styles.left || 0) + 20}px`,
          },
        };
        state.elements.push(newElement);
        state.isDirty = true;
      }
    },

    reorderElements: (state, action) => {
      const { dragIndex, hoverIndex } = action.payload;
      const draggedElement = state.elements[dragIndex];
      state.elements.splice(dragIndex, 1);
      state.elements.splice(hoverIndex, 0, draggedElement);
      state.isDirty = true;
    },

    // ========================================================================
    // SELECTION
    // ========================================================================
    setSelectedElementId: (state, action) => {
      state.selectedElementId = action.payload;
    },

    clearSelection: (state) => {
      state.selectedElementId = null;
    },

    // ========================================================================
    // GLOBAL SETTINGS
    // ========================================================================
    setGlobalSettings: (state, action) => {
      state.globalSettings = { ...state.globalSettings, ...action.payload };
      state.isDirty = true;
    },

    updateGlobalSetting: (state, action) => {
      const { key, value } = action.payload;
      state.globalSettings[key] = value;
      state.isDirty = true;
    },

    // ========================================================================
    // METADATA
    // ========================================================================
    setNewsletterName: (state, action) => {
      state.newsletterName = action.payload;
      state.isDirty = true;
    },

    setCurrentTemplateId: (state, action) => {
      state.currentTemplateId = action.payload;
    },

    // ========================================================================
    // VIEW
    // ========================================================================
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },

    toggleView: (state) => {
      state.activeView = state.activeView === "editor" ? "preview" : "editor";
    },

    // ========================================================================
    // STATE MANAGEMENT
    // ========================================================================
    markAsSaved: (state) => {
      state.isDirty = false;
      state.lastSaved = new Date().toISOString();
    },

    resetEditor: (state) => {
      return { ...initialState };
    },

    clearErrors: (state) => {
      state.saveError = null;
      state.loadError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ========================================================================
      // SAVE NEWSLETTER
      // ========================================================================
      .addCase(saveNewsletter.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(saveNewsletter.fulfilled, (state, action) => {
        state.saving = false;
        state.isDirty = false;
        state.lastSaved = new Date().toISOString();

        // Update template ID if it was a new template
        if (!state.currentTemplateId && action.payload) {
          state.currentTemplateId = action.payload.id;
        }
      })
      .addCase(saveNewsletter.rejected, (state, action) => {
        state.saving = false;
        state.saveError =
          action.payload?.message || "Failed to save newsletter";
      })

      // ========================================================================
      // LOAD TEMPLATE
      // ========================================================================
      .addCase(loadTemplateIntoEditor.pending, (state) => {
        state.loading = true;
        state.loadError = null;
      })
      .addCase(loadTemplateIntoEditor.fulfilled, (state, action) => {
        state.loading = false;
        state.elements = action.payload.elements;
        state.globalSettings = action.payload.globalSettings;
        state.newsletterName = action.payload.name || "Untitled Newsletter";
        state.currentTemplateId =
          action.payload._id || action.payload.id || null;

        state.selectedElementId = null;
        state.isDirty = false;
      })
      .addCase(loadTemplateIntoEditor.rejected, (state, action) => {
        state.loading = false;
        state.loadError = action.payload?.message || "Failed to load template";
      });
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export const {
  setElements,
  addElement,
  updateElement,
  deleteElement,
  duplicateElement,
  reorderElements,
  setSelectedElementId,
  clearSelection,
  setGlobalSettings,
  updateGlobalSetting,
  setNewsletterName,
  setCurrentTemplateId,
  setActiveView,
  toggleView,
  markAsSaved,
  resetEditor,
  clearErrors,
} = editorSlice.actions;

// Selectors
export const selectElements = (state) => state.editor.elements;
export const selectSelectedElement = (state) => {
  const id = state.editor.selectedElementId;
  return state.editor.elements.find((el) => el.id === id) || null;
};
export const selectGlobalSettings = (state) => state.editor.globalSettings;
export const selectNewsletterName = (state) => state.editor.newsletterName;
export const selectIsDirty = (state) => state.editor.isDirty;
export const selectSaving = (state) => state.editor.saving;

export default editorSlice.reducer;
