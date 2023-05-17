import { configureStore } from "@reduxjs/toolkit";

import chatReducer from './chatReducer.js';

export default configureStore({
  reducer: {
    chat: chatReducer,
  },
});