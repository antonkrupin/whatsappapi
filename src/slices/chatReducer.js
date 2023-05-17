import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
	messagesId: [],
	isChatStarted: false,
  error: null,
	idInstance: null,
	apiTokenInstance: null,
	phone: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      if (!state.messagesId.includes(action.payload[0])) {
				state.messagesId.push(action.payload[0]);
				state.messages = [...state.messages, [action.payload[0], action.payload[1], action.payload[2]]];
			}
    },
		setChatStart: (state, action) => {
			state.isChatStarted = !state.isChatStarted;
		},
		setIdInstance: (state, action) => {
			state.idInstance = action.payload;
		},
		setApiTokenInstance: (state, action) => {
			state.apiTokenInstance = action.payload;
		},
		setPhone: (state, action) => {
			state.phone = action.payload;
		},
  }
});

export const {
  addMessage,
	setChatStart,
	setIdInstance,
	setApiTokenInstance,
	setPhone,
} = chatSlice.actions;

export default chatSlice.reducer;