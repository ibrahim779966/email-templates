// redux/slices/templateSlice.js - UPDATED WITH PUBLIC TEMPLATES SUPPORT

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { templateService } from "../../api/services/templateService";

// ============================================================================
// ASYNC THUNKS
// ============================================================================

// Fetch all templates for current workspace (private templates only)
export const fetchTemplates = createAsyncThunk(
  "template/fetchTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await templateService.getTemplatesByWorkId();
      // Filter out public templates - only show user's private templates
      const userTemplates = response.data.data.filter((t) => !t.isPublic);
      return userTemplates;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch templates"
      );
    }
  }
);

// Fetch public templates for gallery
export const fetchPublicTemplates = createAsyncThunk(
  "template/fetchPublicTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await templateService.getPublicTemplates();
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch public templates"
      );
    }
  }
);

// Delete template
export const deleteTemplate = createAsyncThunk(
  "template/deleteTemplate",
  async (templateId, { rejectWithValue }) => {
    try {
      await templateService.deleteTemplate(templateId);
      return templateId; // Return ID for removal from state
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete template"
      );
    }
  }
);

// Duplicate template
export const duplicateTemplate = createAsyncThunk(
  "template/duplicateTemplate",
  async (templateData, { rejectWithValue }) => {
    try {
      const response = await templateService.createTemplate(templateData);
      return response.data.data; // New template object
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to duplicate template"
      );
    }
  }
);

// Create template from gallery (use a public template)
export const createFromGalleryTemplate = createAsyncThunk(
  "template/createFromGalleryTemplate",
  async (galleryTemplate, { rejectWithValue }) => {
    try {
      // Create a new private template based on the gallery template
      const newTemplate = {
        name: `${galleryTemplate.name} (Copy)`,
        elements: galleryTemplate.elements,
        globalSettings: galleryTemplate.globalSettings,
        previewImageUrl: galleryTemplate.previewImageUrl,
        isPublic: false, // Make it private by default
      };

      const response = await templateService.createTemplate(newTemplate);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create template from gallery"
      );
    }
  }
);

// ============================================================================
// SLICE
// ============================================================================

const initialState = {
  // Private user templates
  templates: [],
  templatesLoading: false,
  templatesError: null,

  // Public gallery templates
  publicTemplates: [],
  publicTemplatesLoading: false,
  publicTemplatesError: null,

  // Search
  searchQuery: "",
  publicSearchQuery: "",

  // Selected category for gallery
  selectedCategory: "all",
};

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setPublicSearchQuery: (state, action) => {
      state.publicSearchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearTemplates: (state) => {
      state.templates = [];
      state.templatesError = null;
    },
    clearPublicTemplates: (state) => {
      state.publicTemplates = [];
      state.publicTemplatesError = null;
    },
  },
  extraReducers: (builder) => {
    // ========================================================================
    // FETCH PRIVATE TEMPLATES
    // ========================================================================
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.templatesLoading = true;
        state.templatesError = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.templatesLoading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.templatesLoading = false;
        state.templatesError = action.payload;
      });

    // ========================================================================
    // FETCH PUBLIC TEMPLATES
    // ========================================================================
    builder
      .addCase(fetchPublicTemplates.pending, (state) => {
        state.publicTemplatesLoading = true;
        state.publicTemplatesError = null;
      })
      .addCase(fetchPublicTemplates.fulfilled, (state, action) => {
        state.publicTemplatesLoading = false;
        state.publicTemplates = action.payload;
      })
      .addCase(fetchPublicTemplates.rejected, (state, action) => {
        state.publicTemplatesLoading = false;
        state.publicTemplatesError = action.payload;
      });

    // ========================================================================
    // DELETE TEMPLATE
    // ========================================================================
    builder
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        // Remove deleted template from state
        state.templates = state.templates.filter(
          (t) => t._id !== action.payload
        );
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.templatesError = action.payload;
      });

    // ========================================================================
    // DUPLICATE TEMPLATE
    // ========================================================================
    builder
      .addCase(duplicateTemplate.fulfilled, (state, action) => {
        // Add new template to beginning of array
        state.templates = [action.payload, ...state.templates];
      })
      .addCase(duplicateTemplate.rejected, (state, action) => {
        state.templatesError = action.payload;
      });

    // ========================================================================
    // CREATE FROM GALLERY TEMPLATE
    // ========================================================================
    builder
      .addCase(createFromGalleryTemplate.fulfilled, (state, action) => {
        // Add new template to user's private templates
        state.templates = [action.payload, ...state.templates];
      })
      .addCase(createFromGalleryTemplate.rejected, (state, action) => {
        state.templatesError = action.payload;
      });
  },
});

// ============================================================================
// SELECTORS
// ============================================================================

// Private templates selectors
export const selectTemplates = (state) => state.template.templates;
export const selectTemplatesLoading = (state) =>
  state.template.templatesLoading;
export const selectSearchQuery = (state) => state.template.searchQuery;

// Public templates selectors
export const selectPublicTemplates = (state) => state.template.publicTemplates;
export const selectPublicTemplatesLoading = (state) =>
  state.template.publicTemplatesLoading;
export const selectPublicSearchQuery = (state) =>
  state.template.publicSearchQuery;
export const selectSelectedCategory = (state) =>
  state.template.selectedCategory;

// Filtered private templates based on search query
export const selectFilteredTemplates = (state) => {
  const { templates, searchQuery } = state.template;
  const term = searchQuery.trim().toLowerCase();

  if (!term) return templates;

  return templates.filter((template) => {
    const name = (template.name || "").toLowerCase();
    const date = template.updatedAt
      ? new Date(template.updatedAt).toLocaleDateString().toLowerCase()
      : "";
    return name.includes(term) || date.includes(term);
  });
};

// Filtered public templates based on search and category
export const selectFilteredPublicTemplates = (state) => {
  const { publicTemplates, publicSearchQuery, selectedCategory } =
    state.template;
  const term = publicSearchQuery.trim().toLowerCase();

  let filtered = publicTemplates;

  // Filter by category
  if (selectedCategory !== "all") {
    filtered = filtered.filter(
      (template) =>
        template.category === selectedCategory ||
        (!template.category && selectedCategory === "other")
    );
  }

  // Filter by search query
  if (term) {
    filtered = filtered.filter((template) => {
      const name = (template.name || "").toLowerCase();
      const description = (template.description || "").toLowerCase();
      const category = (template.category || "").toLowerCase();
      return (
        name.includes(term) ||
        description.includes(term) ||
        category.includes(term)
      );
    });
  }

  return filtered;
};

// ============================================================================
// EXPORTS
// ============================================================================

export const {
  setSearchQuery,
  setPublicSearchQuery,
  setSelectedCategory,
  clearTemplates,
  clearPublicTemplates,
} = templateSlice.actions;

export default templateSlice.reducer;
