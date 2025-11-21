import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { templateService } from "../../api/services/templateService";
import { getWorkId } from "../../api/utils/storageHelper";

// ASYNC THUNKS FOR EDITOR OPERATIONS

export const saveNewsletter = createAsyncThunk(
  "editor/saveNewsletter",
  async ({ generateThumbnail }, { getState, rejectWithValue }) => {
    try {
      const state = getState().editor;
      const { elements, globalSettings, newsletterName, currentTemplateId } =
        state;

      // Generate preview thumbnail
      const previewImageUrl = await generateThumbnail();

      const templateData = {
        name: newsletterName || "Untitled Newsletter",
        elements: elements,
        globalSettings: globalSettings,
        previewImageUrl: previewImageUrl,
      };

      let response;
      if (currentTemplateId) {
        // Update existing template
        response = await templateService.updateTemplate(
          currentTemplateId,
          templateData
        );
      } else {
        // Create new template
        response = await templateService.createTemplate(templateData);
      }

      return {
        templateId: response.data.data._id,
        template: response.data.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save template"
      );
    }
  }
);

export const loadTemplateIntoEditor = createAsyncThunk(
  "editor/loadTemplate",
  async ({ templateId }, { rejectWithValue }) => {
    try {
      const response = await templateService.getTemplateById(templateId);
      const template = response.data.data;

      return {
        elements: template.elements || [],
        globalSettings: template.globalSettings || {
          maxWidth: "600px",
          minHeight: "800px",
          backgroundColor: "#f5f5f5",
          newsletterColor: "#ffffff",
          fontFamily: "Arial, sans-serif",
        },
        newsletterName: template.name || "Untitled Newsletter",
        currentTemplateId: template._id,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load template"
      );
    }
  }
);

// Helper: Recursive update element in nested tree
const updateElementInTree = (elements, targetId, updates) => {
  return elements.map((el) => {
    if (el.id === targetId) {
      return { ...el, ...updates };
    }
    if (el.children && el.children.length > 0) {
      return {
        ...el,
        children: updateElementInTree(el.children, targetId, updates),
      };
    }
    return el;
  });
};

// Helper: Recursive delete element in nested tree
const deleteElementInTree = (elements, targetId) => {
  return elements
    .filter((el) => el.id !== targetId)
    .map((el) => {
      if (el.children && el.children.length > 0) {
        return { ...el, children: deleteElementInTree(el.children, targetId) };
      }
      return el;
    });
};

// Helper: Recursive find element in nested tree
const findElementInTree = (elements, targetId) => {
  if (!targetId) return null;

  for (let element of elements) {
    if (element.id === targetId) {
      return element;
    }
    if (element.children && element.children.length > 0) {
      const found = findElementInTree(element.children, targetId);
      if (found) return found;
    }
  }
  return null;
};

const initialState = {
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

  selectedElementId: null,

  globalSettings: {
    backgroundColor: "#f5f5f5",
    maxWidth: "600px",
    fontFamily: "Arial, sans-serif",
    newsletterColor: "#FFFFFF",
    minHeight: "800px",
  },

  newsletterName: "Untitled Newsletter",
  currentTemplateId: null,

  activeView: "editor",

  saving: false,
  saveError: null,
  lastSaved: null,

  loading: false,
  loadError: null,

  isDirty: false,
};

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
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
      // recursively update to handle nested elements
      state.elements = updateElementInTree(state.elements, id, updates);
      state.isDirty = true;
    },

    deleteElement: (state, action) => {
      // recursively delete to handle nested elements
      state.elements = deleteElementInTree(state.elements, action.payload);
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

    setSelectedElementId: (state, action) => {
      state.selectedElementId = action.payload;
    },

    clearSelection: (state) => {
      state.selectedElementId = null;
    },

    setGlobalSettings: (state, action) => {
      state.globalSettings = { ...state.globalSettings, ...action.payload };
      state.isDirty = true;
    },

    updateGlobalSetting: (state, action) => {
      const { key, value } = action.payload;
      state.globalSettings[key] = value;
      state.isDirty = true;
    },

    setNewsletterName: (state, action) => {
      state.newsletterName = action.payload;
      state.isDirty = true;
    },

    setCurrentTemplateId: (state, action) => {
      state.currentTemplateId = action.payload;
    },

    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },

    toggleView: (state) => {
      state.activeView = state.activeView === "editor" ? "preview" : "editor";
    },

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
      .addCase(saveNewsletter.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(saveNewsletter.fulfilled, (state, action) => {
        state.saving = false;
        state.isDirty = false;
        state.lastSaved = new Date().toISOString();

        if (!state.currentTemplateId && action.payload) {
          state.currentTemplateId = action.payload.id;
        }
      })
      .addCase(saveNewsletter.rejected, (state, action) => {
        state.saving = false;
        state.saveError =
          action.payload?.message || "Failed to save newsletter";
      })

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

export const selectElements = (state) => state.editor.elements;

export const selectSelectedElement = (state) => {
  const id = state.editor.selectedElementId;
  if (!id) return null;
  return findElementInTree(state.editor.elements, id);
};

export const selectGlobalSettings = (state) => state.editor.globalSettings;
export const selectNewsletterName = (state) => state.editor.newsletterName;
export const selectIsDirty = (state) => state.editor.isDirty;
export const selectSaving = (state) => state.editor.saving;

export default editorSlice.reducer;
