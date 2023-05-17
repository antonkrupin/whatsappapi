import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setChatStart, setPhone } from '../slices/chatReducer';

const CreateChat = () => {
  useEffect(() => {
    inputRef.current.focus();
  });

  const dispatch = useDispatch();

  const inputRef = useRef();
  return (
    <div className="d-flex flex-column align-items-center">
      <form onSubmit={() => dispatch(setChatStart())}>
        <div className="d-flex justify-content-center">
          <h3>Введите номер телефона, чтобы начать общение.</h3>
        </div>
        <div className="d-flex">
          <input
            required
            onChange={(e) => dispatch(setPhone(e.target.value))}
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
  </div>
  )
};

export default CreateChat;