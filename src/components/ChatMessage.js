import React from 'react';
import ReactMarkdown from 'react-markdown';
import './styles/ChatMessage.css';

function ChatMessage({ msg }) {
  return (
    <div className={`message ${msg.role}`}>
      <ReactMarkdown>{msg.content}</ReactMarkdown>
    </div>
  );
}

export default ChatMessage;
