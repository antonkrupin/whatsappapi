import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Header from './Header';
import Message from './Message';
import {
	fetchMessages,
	fetchChartStart,
	fetchIdInstance,
	fetchApiTokenInstance,
} from '../slices/selectors';
import { addMessage, setChatStart } from '../slices/chatReducer';

import './Chat.css';

const Chat = () => {
	const dispatch = useDispatch();

	const messages = useSelector(fetchMessages);

	const isChatStart = useSelector(fetchChartStart);

	const idInstance = useSelector(fetchIdInstance);

	const apiTokenInstance = useSelector(fetchApiTokenInstance);

	const [phone, setPhone] = useState(null);

	const [message, setMessage] = useState();

	const inputRef = useRef();

	const getReciveNotification = () => {
		fetch(`https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`)
		.then(response => response.text())
		.then(result => JSON.parse(result))
		.then(data => {
			if (data) {
				if (data.body.typeWebhook === "outgoingAPIMessageReceived") {
					dispatch(addMessage([data.body.idMessage, data.body.messageData.extendedTextMessageData.text, data.body.typeWebhook]));
				} else {
					dispatch(addMessage([data.body.idMessage, data.body.messageData.textMessageData.textMessage, data.body.typeWebhook]));
				}
				fetch(`https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${data.receiptId}`, {method: 'DELETE'});
			}
		});
		setTimeout(() => getReciveNotification(), 3000);
	}

	useEffect(() => {
		getReciveNotification();
	}, [messages]);

	const sendMessage = (e) => {
		if (message) {
			fetch(`https://api.green-api.com/waInstance${idInstance}/SendMessage/${apiTokenInstance}`,
			{
				method: 'POST',
				body: JSON.stringify(
					{
						"chatId": `${phone}@c.us`,
						"message": `${message}`,
					}
				)
			});
		}
		
		inputRef.current.value = '';
	}

	return (
		<section>
			<Header />
			<div className="d-flex flex-column align-items-center">
				{!isChatStart && (
					<>
						<div className="d-flex">
							<h3>Введите номер телефона, чтобы начать общение.</h3>
						</div>
						<div className="d-flex justify-content-center startChat">
							<input
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
					</>
				)}
				{isChatStart && (
					<div className="chat">
						<div className="messages">
							{messages.map(message => <Message key={message[0]} text={message[0]} type={message[1]}/>)}
						</div>
						<div className="d-flex justify-content-around inputMessage">
							<input onInput={(e) => setMessage(e.target.value)} ref={inputRef} placeholder="введите сообщение" />
							<button onClick={sendMessage} className="btn btn-primary" >Отправить</button>
						</div>
					</div>
				)}
			</div>
		</section>
	)
};

export default Chat;