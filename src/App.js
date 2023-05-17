import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthorizationForm from './components/AuthorizationForm';
import Chat from './components/Chat';

import './App.css';

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<AuthorizationForm />} />
				<Route path="/chat" element={<Chat />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App;
