import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import CreateChat from './CreateChat';
import Header from './Header';
import Message from './Message';
import {
	fetchMessages,
	fetchChartStart,
	fetchIdInstance,
	fetchApiTokenInstance,
	fetchPhone,
} from '../slices/selectors';
import { addMessage } from '../slices/chatReducer';
import routes from '../routes';

import './Chat.css';

const Chat = () => {
	const dispatch = useDispatch();

	const navigate = useNavigate();

	const messages = useSelector(fetchMessages);

	const isChatStart = useSelector(fetchChartStart);

	const idInstance = useSelector(fetchIdInstance);

	const apiTokenInstance = useSelector(fetchApiTokenInstance);

	const phone = useSelector(fetchPhone);

	const inputMessageRef = useRef();

	const chatWindowRef = useRef();

	const [message, setMessage] = useState();

	const getReciveNotification = () => {
		fetch(routes.receiveNotification(idInstance, apiTokenInstance))
		.then(response => response.text())
		.then(result => JSON.parse(result))
		.then(data => {
			if (data) {
				const { idMessage, typeWebhook } = data.body;
				if (typeWebhook === "outgoingAPIMessageReceived") {
					dispatch(addMessage([idMessage, data.body.messageData.extendedTextMessageData.text, typeWebhook]));
				} else {
					dispatch(addMessage([idMessage, data.body.messageData.textMessageData.textMessage, typeWebhook]));
				}
				fetch(routes.deleteNotification(idInstance, apiTokenInstance, data.receiptId), {method: 'DELETE'});
			}
		});
		
		if (chatWindowRef.current) {
			chatWindowRef.current.scrollTop = chatWindowRef.current.offsetHeight;
		}
		setTimeout(() => getReciveNotification(), 5000);
	}

	useEffect(() => {
		if (!idInstance) {
			navigate('/');
		} else {
			getReciveNotification();
		}
	}, [messages]);

	const sendMessage = (e) => {
		e.preventDefault();
		if (message) {
			fetch(routes.sendMessage(idInstance, apiTokenInstance),
			{
				method: 'POST',
				body: JSON.stringify(
					{
						"chatId": `${phone}@c.us`,
						"message": `${message}`,
					}
				)
			});
			setMessage('');
		}
		
		inputMessageRef.current.value = '';
	}

	return (
		<section>
			<Header />
			<div className="d-flex flex-column align-items-center">
				{!isChatStart && <CreateChat />}
				{isChatStart && (
					<div className="chat">
						<div className="d-flex justify-content-center">
							<h3>Создан чат с абонентом - {phone}</h3>
						</div>
						<div className="messages" ref={chatWindowRef}>
							{messages.map(message => <Message key={message[0]} text={message[0]} type={message[1]}/>)}
						</div>
						<div className="d-flex justify-content-around inputMessage">
							<form onSubmit={sendMessage} className="d-flex">
								<input
									onInput={(e) => setMessage(e.target.value)}
									ref={inputMessageRef}
									placeholder="Введите сообщение"
									required />
								<button type="submit" className="btn btn-primary" >Отправить</button>
							</form>
						</div>
					</div>
				)}
			</div>
		</section>
	)
};

export default Chat;