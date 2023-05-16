import React, { useState } from "react";
import Chat from "./Chat";
// import Message from "./Message";
import './AuthorizationForm.css';

const AuthorizationForm = () => {
	const [idInstance, setIdInstance] = useState(null);
	const [apiTokenInstance, setApiTokenInstance] = useState(null);
	const [phone, setPhone] = useState(null);
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [isChatting, setIsChatting] = useState(false);
	const [error, setError] = useState(null);
	
	const authorize = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(`https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`)
			.then(response => response.text())
			.then(result => JSON.parse(result));
			if (response.stateInstance === "authorized") {
				setIsAuthorized(true);
				setError(null);
			}
		} catch (err) {
			setIsAuthorized(false);
				setError('Проверьте введенные данные, либо авторизуйтесь или зарегистрируйтесь в личном кабинете - green-api.com');
		}
	};

	const startChat = async (e) => {
		e.preventDefault();

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
							<Chat phone={phone} idInstance={idInstance} apiTokenInstance={apiTokenInstance} />
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