import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { templateService } from "../../api/services/templateService";
import azureBlobService from "../../api/services/azureBlobService";
import { getWorkId } from "../../api/utils/storageHelper";

// ============================================================================
// ASYNC THUNKS
// ============================================================================

/**
 * Fetch all templates for current work
 */
export const fetchTemplates = createAsyncThunk(
  "template/fetchTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await templateService.getTemplatesByWorkId();
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Fetch template by ID
 */
export const fetchTemplateById = createAsyncThunk(
  "template/fetchTemplateById",
  async (templateId, { rejectWithValue }) => {
    try {
      const response = await templateService.getTemplateById(templateId);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Delete template
 */
export const deleteTemplate = createAsyncThunk(
  "template/deleteTemplate",
  async (templateId, { rejectWithValue }) => {
    try {
      await templateService.deleteTemplate(templateId);
      return templateId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Duplicate template
 */
export const duplicateTemplate = createAsyncThunk(
  "template/duplicateTemplate",
  async ({ template, newName }, { rejectWithValue }) => {
    try {
      // Fetch template data from Azure
      const templateData = await azureBlobService.fetchAzureData(template.dataUrl);
      
      // Update name
      const duplicatedData = {
        ...templateData,
        name: newName || `${template.name} (Copy)`,
      };

      const workId = getWorkId();
      
      // Upload JSON to Azure
      const jsonBlobName = `work_${workId}/templates/${Date.now()}_${Math.random().toString(36).substr(2, 9)}_data.json`;
      const jsonData = await azureBlobService.uploadRawData(
        duplicatedData,
        jsonBlobName,
        {
          folder: `work_${workId}/templates`,
          container: "templates",
        }
      );

      // Generate and upload HTML
      const htmlTemplateGenerator = (await import("../../api/services/htmlTemplateGenerator")).default;
      const htmlResult = htmlTemplateGenerator.generateEmailHTML(duplicatedData);
      
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

      // Create new template in database
      const newTemplate = await templateService.createTemplate({
        name: duplicatedData.name,
        dataUrl: jsonData.secure_url,
        htmlUrl: htmlData.secure_url,
        dataBlobName: jsonData.blob_name,
        htmlBlobName: htmlData.blob_name,
        previewImageUrl: template.previewImageUrl,
      });

      return newTemplate.data || newTemplate;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Load template data from Azure
 */
export const loadTemplateData = createAsyncThunk(
  "template/loadTemplateData",
  async (dataUrl, { rejectWithValue }) => {
    try {
      const data = await azureBlobService.fetchAzureData(dataUrl);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState = {
  // Templates list
  templates: [],
  templatesLoading: false,
  templatesError: null,

  // Current template
  currentTemplate: null,
  currentTemplateLoading: false,
  currentTemplateError: null,

  // Template data
  templateData: null,
  templateDataLoading: false,
  templateDataError: null,

  // Operations
  creating: false,
  createError: null,
  updating: false,
  updateError: null,
  deleting: false,
  deleteError: null,
  duplicating: false,
  duplicateError: null,

  // Search
  searchQuery: "",
  filteredTemplates: [],
};

// ============================================================================
// SLICE
// ============================================================================

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    // Search
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;

      // Filter templates
      if (action.payload.trim() === "") {
        state.filteredTemplates = state.templates;
      } else {
        const query = action.payload.toLowerCase();
        state.filteredTemplates = state.templates.filter((template) => {
          const name = template.name.toLowerCase();
          const date = template.updatedAt
            ? new Date(template.updatedAt).toLocaleDateString().toLowerCase()
            : "";
          return name.includes(query) || date.includes(query);
        });
      }
    },

    // Current template
    setCurrentTemplate: (state, action) => {
      state.currentTemplate = action.payload;
    },

    clearCurrentTemplate: (state) => {
      state.currentTemplate = null;
      state.currentTemplateError = null;
    },

    // Template data
    clearTemplateData: (state) => {
      state.templateData = null;
      state.templateDataError = null;
    },

    // Errors
    clearErrors: (state) => {
      state.templatesError = null;
      state.currentTemplateError = null;
      state.templateDataError = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.duplicateError = null;
    },

    clearError: (state, action) => {
      const errorType = action.payload;
      state[errorType] = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // ========================================================================
      // FETCH TEMPLATES
      // ========================================================================
      .addCase(fetchTemplates.pending, (state) => {
        state.templatesLoading = true;
        state.templatesError = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.templatesLoading = false;
        state.templates = action.payload;
        state.filteredTemplates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.templatesLoading = false;
        state.templatesError =
          action.payload?.message || "Failed to fetch templates";
      })

      // ========================================================================
      // FETCH TEMPLATE BY ID
      // ========================================================================
      .addCase(fetchTemplateById.pending, (state) => {
        state.currentTemplateLoading = true;
        state.currentTemplateError = null;
      })
      .addCase(fetchTemplateById.fulfilled, (state, action) => {
        state.currentTemplateLoading = false;
        state.currentTemplate = action.payload;
      })
      .addCase(fetchTemplateById.rejected, (state, action) => {
        state.currentTemplateLoading = false;
        state.currentTemplateError =
          action.payload?.message || "Failed to fetch template";
      })

      // ========================================================================
      // DELETE TEMPLATE
      // ========================================================================
      .addCase(deleteTemplate.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.deleting = false;

        // Remove from templates list
        state.templates = state.templates.filter(
          (t) => t._id !== action.payload
        );
        state.filteredTemplates = state.filteredTemplates.filter(
          (t) => t._id !== action.payload
        );

        // Clear current template if it's the same
        if (state.currentTemplate?._id === action.payload) {
          state.currentTemplate = null;
        }
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError =
          action.payload?.message || "Failed to delete template";
      })

      // ========================================================================
      // DUPLICATE TEMPLATE
      // ========================================================================
      .addCase(duplicateTemplate.pending, (state) => {
        state.duplicating = true;
        state.duplicateError = null;
      })
      .addCase(duplicateTemplate.fulfilled, (state, action) => {
        state.duplicating = false;
        state.templates.unshift(action.payload);
        state.filteredTemplates.unshift(action.payload);
      })
      .addCase(duplicateTemplate.rejected, (state, action) => {
        state.duplicating = false;
        state.duplicateError =
          action.payload?.message || "Failed to duplicate template";
      })

      // ========================================================================
      // LOAD TEMPLATE DATA
      // ========================================================================
      .addCase(loadTemplateData.pending, (state) => {
        state.templateDataLoading = true;
        state.templateDataError = null;
      })
      .addCase(loadTemplateData.fulfilled, (state, action) => {
        state.templateDataLoading = false;
        state.templateData = action.payload;
      })
      .addCase(loadTemplateData.rejected, (state, action) => {
        state.templateDataLoading = false;
        state.templateDataError =
          action.payload?.message || "Failed to load template data";
      });
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export const {
  setSearchQuery,
  setCurrentTemplate,
  clearCurrentTemplate,
  clearTemplateData,
  clearErrors,
  clearError,
} = templateSlice.actions;

// Selectors
export const selectTemplates = (state) => state.template.templates;
export const selectFilteredTemplates = (state) =>
  state.template.filteredTemplates;
export const selectTemplatesLoading = (state) =>
  state.template.templatesLoading;
export const selectCurrentTemplate = (state) => state.template.currentTemplate;
export const selectTemplateData = (state) => state.template.templateData;
export const selectSearchQuery = (state) => state.template.searchQuery;

export default templateSlice.reducer;