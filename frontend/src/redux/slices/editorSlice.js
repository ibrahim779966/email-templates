import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { templateService } from "../../api/services/templateService";
import azureBlobService from "../../api/services/azureBlobService"; // ✅ CHANGED
import htmlTemplateGenerator from "../../api/services/htmlTemplateGenerator"; // ✅ NEW
import { getWorkId } from "../../api/utils/storageHelper";

// ============================================================================
// ASYNC THUNKS FOR EDITOR OPERATIONS
// ============================================================================

/**
 * Save or update the current newsletter
 * ✅ UPDATED: Now generates HTML and uploads to Azure
 */
export const saveNewsletter = createAsyncThunk(
  "editor/saveNewsletter",
  async ({ generateThumbnail }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { elements, globalSettings, newsletterName, currentTemplateId } =
        state.editor;

      const workId = getWorkId();

      // Step 1: Generate thumbnail
      let thumbnailUrl = null;
      let thumbnailBlobName = null;
      if (generateThumbnail) {
        const thumbnailDataUrl = await generateThumbnail();
        if (thumbnailDataUrl) {
          const blob = await fetch(thumbnailDataUrl).then((r) => r.blob());
          const thumbBlobName = `work_${workId}/thumbnails/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.png`;
          
          const thumbData = await azureBlobService.uploadImage(blob, thumbBlobName, {
            folder: `work_${workId}/thumbnails`,
            container: "templates",
          });
          
          thumbnailUrl = thumbData.secure_url;
          thumbnailBlobName = thumbData.blob_name;
        }
      }

      // Step 2: Prepare template data
      const templateData = {
        name: newsletterName || "Untitled",
        elements,
        globalSettings,
        workId,
        createdAt: currentTemplateId ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Step 3: Generate HTML for email campaigns ✅ NEW
      const htmlResult = htmlTemplateGenerator.generateEmailHTML(templateData);
      
      if (!htmlResult.success) {
        throw new Error("Failed to generate HTML template");
      }

      // Step 4: Upload JSON data to Azure ✅ CHANGED
      const jsonBlobName = `work_${workId}/templates/${Date.now()}_${Math.random().toString(36).substr(2, 9)}_data.json`;
      
      const jsonData = await azureBlobService.uploadRawData(
        templateData,
        jsonBlobName,
        {
          folder: `work_${workId}/templates`,
          container: "templates",
        }
      );

      // Step 5: Upload HTML file to Azure ✅ NEW
      const htmlBlobName = `work_${workId}/templates/${Date.now()}_${Math.random().toString(36).substr(2, 9)}_email.html`;
      
      const htmlData = await azureBlobService.uploadRawData(
        htmlResult.html,
        htmlBlobName,
        {
          folder: `work_${workId}/templates`,
          container: "templates",
          contentType: "text/html",
        }
      );

      // Step 6: Create or update in database ✅ CHANGED
      let response;
      if (currentTemplateId) {
        // UPDATE existing template
        const updates = {
          name: newsletterName || "Untitled",
          dataUrl: jsonData.secure_url,        // ✅ CHANGED from cloudinaryUrl
          htmlUrl: htmlData.secure_url,        // ✅ NEW
          dataBlobName: jsonData.blob_name,    // ✅ NEW
          htmlBlobName: htmlData.blob_name,    // ✅ NEW
        };
        
        if (thumbnailUrl) {
          updates.previewImageUrl = thumbnailUrl;
          updates.thumbnailBlobName = thumbnailBlobName; // ✅ NEW
        }
        
        response = await templateService.updateTemplate(
          currentTemplateId,
          updates
        );
      } else {
        // CREATE new template
        response = await templateService.createTemplate({
          name: newsletterName || "Untitled",
          dataUrl: jsonData.secure_url,        // ✅ CHANGED from cloudinaryUrl
          htmlUrl: htmlData.secure_url,        // ✅ NEW
          dataBlobName: jsonData.blob_name,    // ✅ NEW
          htmlBlobName: htmlData.blob_name,    // ✅ NEW
          previewImageUrl: thumbnailUrl,
          thumbnailBlobName: thumbnailBlobName, // ✅ NEW
        });
      }

      console.log("✓ Template saved successfully:", response);
      return response.data || response;
      
    } catch (error) {
      console.error("✗ Error saving template:", error);
      return rejectWithValue({
        message: error.message || "Failed to save newsletter",
        code: error.code,
        status: error.status,
      });
    }
  }
);

/**
 * Load a template into the editor
 * ✅ UPDATED: Now uses Azure Blob Storage
 */
export const loadTemplateIntoEditor = createAsyncThunk(
  "editor/loadTemplate",
  async ({ templateId, dataUrl }, { rejectWithValue }) => {
    try {
      let templateData;

      if (dataUrl) {
        // Load directly from Azure URL ✅ CHANGED
        templateData = await azureBlobService.fetchAzureData(dataUrl);
      } else if (templateId) {
        // Fetch template metadata from database
        const template = await templateService.getTemplateById(templateId);

        // Check for dataUrl ✅ CHANGED from cloudinaryUrl
        if (!template || !template.dataUrl) {
          throw new Error("Template not found or missing data URL");
        }

        // Load template data from Azure ✅ CHANGED
        templateData = await azureBlobService.fetchAzureData(template.dataUrl);
        templateData._id = template._id || template.id;
      } else {
        throw new Error("Either templateId or dataUrl is required");
      }

      // Validate template data
      if (!templateData || !templateData.elements) {
        throw new Error("Invalid template data - missing elements");
      }

      console.log("✓ Template loaded successfully");
      return templateData;
      
    } catch (error) {
      console.error("✗ Error loading template:", error);
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
          state.currentTemplateId = action.payload._id || action.payload.id;
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



// ---

// ## 🔧 **What Happens When You Save Now**
// ```
// User Saves Template
//        ↓
// 1. Generate Thumbnail → Upload to Azure
// 2. Generate HTML from template data
// 3. Upload JSON data → Azure Blob Storage
// 4. Upload HTML file → Azure Blob Storage
// 5. Save metadata to Database:
//    - dataUrl (JSON URL for editing)
//    - htmlUrl (HTML URL for campaigns) ← NEW!
//    - dataBlobName (for deletion)
//    - htmlBlobName (for deletion)