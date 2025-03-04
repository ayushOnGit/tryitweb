import React from 'react';
import './styles/ChatInput.css';
import { ThreeDots } from 'react-loader-spinner';

function ChatInput({ input, setInput, loading, handleSendMessage }) {
  const handleSend = () => {
    if (!loading && input.trim() !== "") {
      handleSendMessage();
      setInput(""); // Clear the input after sending the message
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`input-container ${loading ? 'loading' : ''}`}>
      <div className="input-wrapper">
        <div className="action-buttons">
          <button className="search-button" disabled={loading}>Search</button>
          <button className="reason-button" disabled={loading}>Reason</button>
        </div>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={loading ? "Thinking..." : "Ask Tryit!"}
          disabled={loading}
        />

        <button
          onClick={handleSend}
          className="send-button"
          disabled={loading}
        >
          {loading ? (
            <ThreeDots 
              height="24" 
              width="24" 
              radius="9"
              color="#ffffff" 
              ariaLabel="three-dots-loading"
              visible={true}
            />
          ) : "➤"}
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
