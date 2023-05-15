import React, { useState } from "react";
import './AuthorizationForm.css';

const AuthorizationForm = () => {
	const [idInstance, setIdInstance] = useState(null);
	const [apiTokenInstance, setApiTokenInstance] = useState(null);
	const [phone, setPhone] = useState(null);
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [isChatting, setIsChatting] = useState(false);
	const [error, setError] = useState(null);

	const [message, setMessage] = useState('start');

	const authorize = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(`https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`);
			if (response.status === 200) {
				setIsAuthorized(true);
				setError(null);
			} else {
				setIsAuthorized(false);
				setError('Проверьте введенные данные, либо авторизуйтесь или зарегистрируйтесь в личном кабинете - green-api.com');
			}
		} catch (err) {
			
		}
	};

	const loadChatHistory = async () => {
		const response = await fetch(`https://api.green-api.com/waInstance${idInstance}/GetChatHistory/${apiTokenInstance}`,
		{
			method: 'POST',
			body: JSON.stringify({
				"chatId": `${phone}@c.us`,
			})
		});

		const reader = response.body.getReader();
	
		let result = '[]';
		const utf8decoder = new TextDecoder();
		while (true) {
			const { value, done } = await reader.read();
			console.log(utf8decoder.decode(value));
			result += utf8decoder.decode(value);
			if (done) break;
		}
		console.log(response.text());
		console.log('result', result);
		const test1 = JSON.stringify(result);
		console.log('restul1', test1);
		console.log('length', test1.length);
		return result;
	}

	const startChat = async (e) => {
		e.preventDefault();
		// const test = loadChatHistory();
		
		const response = await fetch(`https://api.green-api.com/waInstance${idInstance}/SendMessage/${apiTokenInstance}`,
		{
			method: 'POST',
			body: JSON.stringify(
				{
					"chatId": `${phone}@c.us`,
					"message": `${message}`,
				}
			)
		}).then(response => response.text())
		.then(result => console.log(result));
		const test1 = await fetch('https://api.green-api.com/waInstance1101820395/ReceiveNotification/d456247c2f3d47edba84182e30a245dbb3041460a08d443694').then(response => response.text())
		.then(result => console.log(result));;
		
		setIsChatting(true);
	};

	return (
		<div className="d-flex flex-column align-items-center">
			<div className="d-flex">
				{!isAuthorized && (
					<h3>Введите учетные данные для системы GREEN-API.</h3>
				)}
				{isAuthorized && (
					<h3>Введите номер телефона, чтобы начать общение.</h3>
				)}
			</div>
			<form method="post" className="d-flex flex-column align-items-center">
				{!isAuthorized && (
					<>
					<input
						onChange={(e) => setIdInstance(e.target.value)}
						type="email"
						className="form-control"
						id="idInstance"
						aria-describedby="idInstance"
						placeholder="Введите idInstance"
					/>
					<input
						onChange={(e) => setApiTokenInstance(e.target.value)}
						type="password"
						className="form-control"
						id="apiTokenInstance"
						placeholder="Введите apiTokenInstance"
					/>
					<button
						onClick={authorize}
						type="submit"
						className="btn btn-primary"
					>
						Войти
					</button>
					</>
				)}
				{isAuthorized && (
					<>
						{!isChatting && (
							<>
								<input
									onChange={(e) => setPhone(e.target.value)}
									type="text"
									className="form-control"
									id="chatPhone"
									aria-describedby="phone"
									placeholder="Номер телефона - 79001234567"
								/>
								<button
									onClick={startChat}
									type="submit"
									className="btn btn-primary"
								>
									Написать
								</button>
							</>
						)}
						{isChatting && (
							<>
								<div className="chat">
									<div className="messages">
										
									</div>
									<div className="inputMessage">
										<input onInput={(e) => setMessage(e.target.value)} placeholder="введите сообщение"/>
										<button onClick={startChat}>Отправить сообщение</button>
									</div>
								</div>
							</>
						)}
					</>
				)}
				{error && (
					<div className="d-flex error">
						{error}
					</div>
				)}
			</form>
		</div>
	)
};

export default AuthorizationForm;