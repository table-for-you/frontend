import { configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./auth";
import inViewReducer from "./inView";

export default configureStore({
  reducer: {
    authToken: tokenReducer,
    inView: inViewReducer,
  },
});
