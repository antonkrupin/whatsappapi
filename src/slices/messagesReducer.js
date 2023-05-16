import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  error: null,
}

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      console.log(action.payload);
      state.messages.push(action.payload);
    },
  }
});

export const {
  addMessage,
} = messagesSlice.actions;

export default messagesSlice.reducer;