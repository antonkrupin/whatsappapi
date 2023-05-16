import React from 'react';
import './Message.css';

const Message = (props) => {
  if (props.type === "outgoingAPIMessageReceived" || props.type === "outgoingMessageReceived") {
    return (
      <div className="message outgoing">
        <h6>
          {props.text}
        </h6>
      </div>
    )
  }
  return (
    <div className="message">
      <h6>
        {props.text}
      </h6>
    </div>
  ) 
};

export default Message;