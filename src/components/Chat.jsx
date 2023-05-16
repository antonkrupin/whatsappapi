import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Message from './Message';
import {
	fetchMessages
} from '../slices/selectors';
import { addMessage } from '../slices/messagesReducer';

const Chat = (props) => {
	const {
		// history,
		phone,
		idInstance,
		apiTokenInstance
	} = props;

	const messages = useSelector(fetchMessages);

	// const [history, setHistory] = useState([]);

	const [message, setMessage] = useState();

	const inputRef = useRef();

	const dispatch = useDispatch();

	/* const addMessage = (message) => {
		setHistory([...history, message]);
	} */

	const getReciveNotification = () => {
		const response = fetch(`https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`)
		.then(response => response.text())
		.then(result => JSON.parse(result))
		.then(data => {
			if (data) {
				console.log(data);
				if (data.body.typeWebhook === "outgoingAPIMessageReceived") {
					// addMessage([data.body.messageData.extendedTextMessageData.text, data.body.typeWebhook]);
					dispatch(addMessage([data.body.idMessage, data.body.messageData.extendedTextMessageData.text, data.body.typeWebhook]));
				} else {
					// addMessage([data.body.messageData.textMessageData.textMessage, data.body.typeWebhook]);
					dispatch(addMessage([data.body.idMessage, data.body.messageData.textMessageData.textMessage, data.body.typeWebhook]));
				}
				fetch(`https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${data.receiptId}`, {method: 'DELETE'});
			}
		});

		
		
		/*
		receiptId - номер для удаления
		body.messageData.extendedTextMessageData.text - текст сообщения если пришло, ушло через апи
		body.messageData.textMessageData.textMessage - если сообщение не через апи.
		body.typeWebhook - тип сообщения, если отправляешь сам себе через api "outgoingAPIMessageReceived"
		body.typeWebhook - "incomingMessageReceived" входящие не через api
		body.typeWebhook - "incomingAPIMessageReveived" входящие через api
		если отправил не через апи - outgoingMessageReceived
		*/
		setTimeout(() => getReciveNotification(), 5000);
	}

	const sendMessage = (e) => {
		e.preventDefault();
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
		getReciveNotification();
	}

	return (
		<>
			<div className="chat">
				<div className="messages">
					{messages.map(message => <Message key={message[0]} text={message[1]} type={message[2]}/>)}
				</div>
				<div className="d-flex justify-content-around inputMessage">
					<input onInput={(e) => setMessage(e.target.value)} ref={inputRef} placeholder="введите сообщение" />
					<button onClick={sendMessage} className="btn btn-primary" >Отправить</button>
				</div>
			</div>
		</>
	)
};

export default Chat;