import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Message from './Message';
import {
  fetchMessages,
  fetchIdInstance,
  fetchApiTokenInstance,
  fetchPhone
} from '../slices/selectors';
import { addMessage } from '../slices/chatReducer';
import routes from '../routes';

const ChatWindow = () => {
  const dispatch = useDispatch();

  const inputMessageRef = useRef();

  const chatWindowRef = useRef();

  const messages = useSelector(fetchMessages);

  const idInstance = useSelector(fetchIdInstance);

	const apiTokenInstance = useSelector(fetchApiTokenInstance);

	const phone = useSelector(fetchPhone);

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
		setTimeout(() => getReciveNotification(), 2000);
	}

	useEffect(() => {
		getReciveNotification();
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
    inputMessageRef.current.focus();
	}

  return (
    <div className="d-flex flex-column align-items-center">
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
    </div>
  )
};

export default ChatWindow;