import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
	messagesId: [],
	isChatStarted: false,
  error: null,
	idInstance: null,
	apiTokenInstance: null,
	isLoggedIn: false,
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
		setIsLoggedIn: (state, action) => {
			state.isLoggedIn = !state.isLoggedIn;
		}
  }
});

export const {
  addMessage,
	setChatStart,
	setIdInstance,
	setApiTokenInstance,
	setIsLoggedIn,
} = chatSlice.actions;

export default chatSlice.reducer;