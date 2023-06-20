import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import Message from './Message';
import {
  fetchMessages,
  fetchIdInstance,
  fetchApiTokenInstance,
  fetchPhone
} from '../slices/selectors';
import { addMessage, setChatStart, clearMessages } from '../slices/chatReducer';
import routes from '../routes';

const ChatWindow = () => {
  const dispatch = useDispatch();

	const navigate = useNavigate();

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
				console.log(data);
				console.log(idMessage)
				if (typeWebhook === "outgoingAPIMessageReceived") {
					dispatch(addMessage([idMessage, data.body.messageData.extendedTextMessageData.text, typeWebhook]));
				} else {
					dispatch(addMessage([idMessage, data.body.messageData.textMessageData.textMessage, typeWebhook]));
				}
				fetch(routes.deleteNotification(idInstance, apiTokenInstance, data.receiptId), {method: 'DELETE'});
			}
		});
		
		setTimeout(() => getReciveNotification(), 8000);
	};

	useEffect(() => {
		getReciveNotification();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages]);

	const sendMessage = (e) => {
		e.preventDefault();
		if (message) {
			console.log(message);
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
	};

	const endChat = () => {
		dispatch(clearMessages());
		dispatch(setChatStart());
		navigate('/chat');
		// eslint-disable-next-line no-restricted-globals
		location.reload();
	};

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="chat">
        <div className="d-flex justify-content-around align-items-center">
          <h3>Чат с абонентом - {phone}</h3>
					<button onClick={endChat} className="btn btn-danger" >Завершить чат</button>
        </div>
        <div className="messages" ref={chatWindowRef}>
          {messages.map(message => <Message key={message[0]} text={message[1]} type={message[2]}/>)}
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