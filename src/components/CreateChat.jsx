import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIdInstance, fetchApiTokenInstance } from '../slices/selectors';
import { setChatStart, setPhone } from '../slices/chatReducer';
import routes from '../routes';

const CreateChat = () => {
  useEffect(() => {
    inputRef.current.focus();
  });

  const dispatch = useDispatch();

  const inputRef = useRef();

  const idInstance = useSelector(fetchIdInstance);

	const apiTokenInstance = useSelector(fetchApiTokenInstance);

  const [error, setError] = useState(null);

  const startChat = (e) => {
    e.preventDefault();
    const phone = inputRef.current.value;
    if (!isNaN(phone)) {
      fetch(routes.checkWhatsapp(idInstance, apiTokenInstance), 
      {
        method: 'POST',
        body: JSON.stringify(
					{
						"phoneNumber": phone
					}
				)
      })
      .then(response => response.text())
		  .then(result => JSON.parse(result))
      .then(data => {
        if (data.existsWhatsapp) {
          dispatch(setPhone(Number(phone)));
          dispatch(setChatStart());
        } else {
          setError('На устройстве не установлено приложение WhatsApp. Проверьте ввёденный номер.');
        }
      });
    } else {
      setError('Номер телефона должен быть в формате 79001234567.');
    }
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <form onSubmit={startChat}>
        <div className="d-flex justify-content-center">
          <h3>Введите номер телефона, чтобы начать общение.</h3>
        </div>
        <div className="d-flex">
          <input
            required
            type="text"
            className="form-control"
            id="chatPhone"
            aria-describedby="phone"
            placeholder="Номер телефона - 79001234567"
            ref={inputRef}
          />
          <button
            type="submit"
            className="btn btn-primary"
          >
            Создать чат
          </button>
        </div>
      </form>
      {error && (
        <div className="d-flex error">
          {error}
        </div>
      )}
  </div>
  )
};

export default CreateChat;