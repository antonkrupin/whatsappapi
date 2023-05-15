import React from 'react';
import './Message.css';

const Message = (props) => {
  if (props.type === "outgoing") {
    return (
      <div className="bg-info message outgoing">
        <h6>
          {props.text}
        </h6>
      </div>
    )
  }
  return (
    <div className="bg-danger message">
      <h6>
        {props.text}
      </h6>
    </div>
  ) 
};

export default Message;