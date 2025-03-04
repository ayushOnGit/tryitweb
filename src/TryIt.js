import React, { useState } from 'react';
import ChatHeader from './components/ChatHeader';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import SkeletonMessage from './components/SkeletonMessage';
import useChat from './hooks/useChat';
import './components/styles/tryit.css';  // Import global styles

function TryGPT() {
  const [input, setInput] = useState("");
  const { messages, loading, messagesEndRef, handleSendMessage } = useChat();

  return (
    <div className="chat-container">
      <ChatHeader />

      <div className="messages-container">
        <div className="messages-inner">
          {messages.length === 0 && (
            <div className="greeting-message">
              <h2>What are you working on today?</h2>
            </div>
          )}

          {/* {loading && <SkeletonMessage />} */}
          {messages.map((msg, index) => (
            <ChatMessage key={index} msg={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        loading={loading}
        handleSendMessage={() => handleSendMessage(input)}
      />
    </div>
  );
}

export default TryGPT;
