import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import Header from './Header';
import Message from './Message';
import {
	fetchMessages,
	fetchChartStart,
	fetchIdInstance,
	fetchApiTokenInstance,
} from '../slices/selectors';
import { addMessage, setChatStart } from '../slices/chatReducer';
import routes from '../routes';

import './Chat.css';

const Chat = () => {
	const dispatch = useDispatch();

	const navigate = useNavigate();

	const messages = useSelector(fetchMessages);

	const isChatStart = useSelector(fetchChartStart);

	const idInstance = useSelector(fetchIdInstance);

	const apiTokenInstance = useSelector(fetchApiTokenInstance);

	const [phone, setPhone] = useState(null);

	const [message, setMessage] = useState();

	const inputRef = useRef();

	const messagesRef = useRef();

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
		
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.offsetHeight;
		}
		setTimeout(() => getReciveNotification(), 2000);
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
		
		inputRef.current.value = '';
	}

	return (
		<section>
			<Header />
			<div className="d-flex flex-column align-items-center">
				{!isChatStart && (
					<>
						<form>
							<div className="d-flex">
								<h3>Введите номер телефона, чтобы начать общение.</h3>
							</div>
							<div className="d-flex justify-content-center startChat">
								<input
									required
									onChange={(e) => setPhone(e.target.value)}
									type="text"
									className="form-control"
									id="chatPhone"
									aria-describedby="phone"
									placeholder="Номер телефона - 79001234567"
								/>
								<button
									onClick={() => dispatch(setChatStart())}
									type="submit"
									className="btn btn-primary"
								>
									Создать чат
								</button>
							</div>
						</form>
					</>
				)}
				{isChatStart && (
					<div className="chat">
						<div className="messages" ref={messagesRef}>
							{messages.map(message => <Message key={message[0]} text={message[0]} type={message[1]}/>)}
						</div>
						<div className="d-flex justify-content-around inputMessage">
							<form className="d-flex">
								<input onInput={(e) => setMessage(e.target.value)} ref={inputRef} placeholder="Введите сообщение" required/>
								<button onClick={sendMessage} type="submit" className="btn btn-primary" >Отправить</button>
							</form>
						</div>
					</div>
				)}
			</div>
		</section>
	)
};

export default Chat;