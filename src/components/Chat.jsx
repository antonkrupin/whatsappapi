import React, { useState } from 'react';
import Message from './Message';

const Chat = (props) => {
	const {
		// history,
		phone,
		idInstance,
		apiTokenInstance
	} = props;

	const [history, setHistory] = useState([]);

	const [message, setMessage] = useState();

	const addMessage = (message) => {
		setHistory([...history, message]);
	}

	const getReciveNotification = async () => {
		const response = await fetch(`https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`)
		.then(response => response.text())
		.then(result => JSON.parse(result));
		if (response) {
			if (response.body.typeWebhook === "outgoingAPIMessageReceived") {
				addMessage([response.body.messageData.extendedTextMessageData.text, response.body.typeWebhook]);
			} else {
				addMessage([response.body.messageData.textMessageData.textMessage, response.body.typeWebhook]);
			}
			await fetch(`https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${response.receiptId}`, {method: 'DELETE'});
		}
		console.log(history);
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

	const sendMessage = async (e) => {
		e.preventDefault();
		if (message) {
			await fetch(`https://api.green-api.com/waInstance${idInstance}/SendMessage/${apiTokenInstance}`,
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
		getReciveNotification();
	}

	return (
		<>
			<div className="chat">
				<div className="messages">
					{history.map(message => <Message text={message[0]} type={message[1]}/>)}
				</div>
				<div className="d-flex justify-content-around inputMessage">
					<input onInput={(e) => setMessage(e.target.value)} placeholder="введите сообщение"/>
					<button onClick={sendMessage} className="btn btn-primary">Отправить</button>
				</div>
			</div>
		</>
	)
};

export default Chat;