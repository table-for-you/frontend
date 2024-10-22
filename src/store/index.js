import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./auth";
import inViewReducer from "./inView";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authToken"],
};

const rootReducer = combineReducers({
  authToken: tokenReducer,
  inView: inViewReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
        ignoredActionPaths: ["register", "rehydrate"],
        ignoredPaths: ["register", "rehydrate"],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
