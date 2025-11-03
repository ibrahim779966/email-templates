import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

// Import slices
import templateReducer from "./slices/templateSlice";
import editorReducer from "./slices/editorSlice";
import uiReducer from "./slices/uiSlice";

// Combine reducers
const rootReducer = combineReducers({
  template: templateReducer,
  editor: editorReducer,
  ui: uiReducer,
});

// Persist configuration
const persistConfig = {
  key: "newsletter-app",
  version: 1,
  storage,
  whitelist: ["editor"], // Only persist editor state
  blacklist: ["template", "ui"], // Don't persist templates and UI (fetch fresh from API)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
