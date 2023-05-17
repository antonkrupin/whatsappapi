import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import CreateChat from './CreateChat';
import ChatWindow from './ChatWindow';
import Header from './Header';

import {
	fetchChartStart,
	fetchIdInstance,
} from '../slices/selectors';

import './Chat.css';

const Chat = () => {
	const navigate = useNavigate();

	const isChatStart = useSelector(fetchChartStart);

	const idInstance = useSelector(fetchIdInstance);

	useEffect(() => {
		if (!idInstance) {
			navigate('/');
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<section>
			<Header />
			<div className="d-flex flex-column align-items-center">
				{!isChatStart && <CreateChat />}
				{isChatStart && <ChatWindow />}
			</div>
		</section>
	)
};

export default Chat;