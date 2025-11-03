import { createSlice } from "@reduxjs/toolkit";

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState = {
  // Notifications
  notifications: [],

  // Loading states
  globalLoading: false,
  loadingMessage: "",

  // Modals
  modals: {
    templatePicker: false,
    shareDialog: false,
    settingsDialog: false,
    confirmDialog: false,
  },

  // Confirm dialog data
  confirmDialog: {
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
  },

  // Sidebar
  sidebarCollapsed: false,

  // Theme
  theme: "light", // 'light' | 'dark'
};

// ============================================================================
// SLICE
// ============================================================================

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // ========================================================================
    // NOTIFICATIONS
    // ========================================================================
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        type: action.payload.type || "info", // 'success' | 'error' | 'warning' | 'info'
        message: action.payload.message,
        duration: action.payload.duration || 3000,
        timestamp: new Date().toISOString(),
      };
      state.notifications.push(notification);
    },

    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },

    // ========================================================================
    // LOADING
    // ========================================================================
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload.loading;
      state.loadingMessage = action.payload.message || "";
    },

    clearGlobalLoading: (state) => {
      state.globalLoading = false;
      state.loadingMessage = "";
    },

    // ========================================================================
    // MODALS
    // ========================================================================
    openModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
      }
    },

    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
      }
    },

    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key] = false;
      });
    },

    // ========================================================================
    // CONFIRM DIALOG
    // ========================================================================
    showConfirmDialog: (state, action) => {
      state.confirmDialog = {
        title: action.payload.title,
        message: action.payload.message,
        onConfirm: action.payload.onConfirm,
        onCancel: action.payload.onCancel,
      };
      state.modals.confirmDialog = true;
    },

    hideConfirmDialog: (state) => {
      state.modals.confirmDialog = false;
      state.confirmDialog = {
        title: "",
        message: "",
        onConfirm: null,
        onCancel: null,
      };
    },

    // ========================================================================
    // SIDEBAR
    // ========================================================================
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },

    // ========================================================================
    // THEME
    // ========================================================================
    setTheme: (state, action) => {
      state.theme = action.payload;
    },

    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

// ============================================================================
// EXPORTS
// ============================================================================

export const {
  addNotification,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
  clearGlobalLoading,
  openModal,
  closeModal,
  closeAllModals,
  showConfirmDialog,
  hideConfirmDialog,
  toggleSidebar,
  setSidebarCollapsed,
  setTheme,
  toggleTheme,
} = uiSlice.actions;

// Selectors
export const selectNotifications = (state) => state.ui.notifications;
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectModals = (state) => state.ui.modals;
export const selectTheme = (state) => state.ui.theme;

export default uiSlice.reducer;
