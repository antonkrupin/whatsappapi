import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import Header from "./Header";
import { setIdInstance, setApiTokenInstance } from "../slices/chatReducer";
import { fetchApiTokenInstance, fetchIdInstance } from "../slices/selectors";
import routes from "../routes";

import './AuthorizationForm.css';

const AuthorizationForm = () => {
	const navigate = useNavigate();

	const dispatch = useDispatch();

	const idInstanceRef = useRef();

	const idInstance = useSelector(fetchIdInstance);

	const apiTokenInstance = useSelector(fetchApiTokenInstance);

	const [error, setError] = useState(null);

	useEffect(() => {
		idInstanceRef.current.focus();
	});

	const authorize = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(routes.authorization(idInstance, apiTokenInstance))
			.then(response => response.text())
			.then(result => JSON.parse(result));
			if (response.stateInstance === "authorized") {
				navigate("/chat");
				setError(null);
			}
		} catch (err) {
				setError('Проверьте введенные данные, либо авторизуйтесь или зарегистрируйтесь в личном кабинете - green-api.com');
		}
	};

	return (
		<section>
			<Header />
			<div className="d-flex flex-column align-items-center">
				<div className="d-flex">
					<h3>Введите учетные данные для системы GREEN-API.</h3>
				</div>
				<form onSubmit={authorize} className="d-flex flex-column align-items-center">
					<input
						onChange={(e) => dispatch(setIdInstance(e.target.value))}
						type="text"
						className="form-control"
						id="idInstance"
						aria-describedby="idInstance"
						placeholder="Введите idInstance"
						required
						ref={idInstanceRef}
					/>
					<input
						onChange={(e) => dispatch(setApiTokenInstance(e.target.value))}
						type="text"
						className="form-control"
						id="apiTokenInstance"
						placeholder="Введите apiTokenInstance"
						required
					/>
					<button
						className="btn btn-primary"
					>
						Войти
					</button>
					{error && (
						<div className="d-flex error">
							{error}
						</div>
					)}
				</form>
			</div>
		</section>
	)
};

export default AuthorizationForm;