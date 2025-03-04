import React from 'react';
import './styles/ChatHeader.css';

function ChatHeader() {
  return (
    <header className="chat-header">
      <div className="header-content">
        <h1 className="logo">Tryit!</h1>
        <div className="memory-status">
          <button className="get-it-button">Get it!</button>
        </div>
      </div>
    </header>
  );
}

export default ChatHeader;
