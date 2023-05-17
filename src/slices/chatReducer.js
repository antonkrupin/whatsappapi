import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
	messagesId: [],
	isChatStarted: false,
  error: null,
	idInstance: null,
	apiTokenInstance: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      if (!state.messagesId.includes(action.payload[0])) {
				state.messagesId.push(action.payload[0]);
				state.messages = [...state.messages, [action.payload[1], action.payload[2]]];
			}
      //state.messages.push(action.payload);
			// state.messages = [...state.messages, action.payload];
    },
		setChatStart: (state, action) => {
			state.isChatStarted = !state.isChatStarted;
		},
		setIdInstance: (state, action) => {
			state.idInstance = action.payload;
		},
		setApiTokenInstance: (state, action) => {
			state.apiTokenInstance = action.payload;
		}
  }
});

export const {
  addMessage,
	setChatStart,
	setIdInstance,
	setApiTokenInstance,
} = chatSlice.actions;

export default chatSlice.reducer;