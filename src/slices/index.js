import { configureStore } from "@reduxjs/toolkit";

import messagesReducer from './messagesReducer.js';

export default configureStore({
  reducer: {
    messages: messagesReducer,
  },
});