import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { ThreeDots } from 'react-loader-spinner';

const SkeletonMessage = () => (
  <div
    style={{
      maxWidth: "75%",
      padding: "12px",
      borderRadius: "20px",
      marginBottom: "12px",
      backgroundColor: "#333",
      color: "#fff",
      opacity: 0.7,
    }}
  >
    <div
      style={{
        width: "80%",
        height: "20px",
        backgroundColor: "#444",
        borderRadius: "8px",
        marginBottom: "8px",
      }}
    ></div>
    <div
      style={{
        width: "60%",
        height: "20px",
        backgroundColor: "#444",
        borderRadius: "8px",
      }}
    ></div>
  </div>
);

export default function BixGPT() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const messagesEndRef = useRef(null);
  const streamingRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const streamResponse = (responseText) => {
    const words = responseText.split(' ');
    let i = 0;
    
    const stream = () => {
      if (i < words.length) {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          const newContent = lastMessage.content + (i === 0 ? '' : ' ') + words[i];
          return [
            ...newMessages.slice(0, -1),
            { ...lastMessage, content: newContent }
          ];
        });
        i++;
        streamingRef.current = setTimeout(stream, 100);
      }
    };

    stream();
  };

//   const handleSendMessage = async () => {
//     if (!input.trim() && !image) return;

//     const newMessages = [...messages, { role: "user", content: input, image }];
//     setMessages(newMessages);
//     setInput("");
//     setImage(null);
//     setLoading(true);

//     console.log("process.env:", process.env);

//     try {
//         const response = await axios.post(
//           process.env.REACT_APP_API_LINK,
//           {
//             model: "gpt-4o",
//             messages: newMessages,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//               "api-key": process.env.REACT_APP_API_KEY,
//             },
//           }
//         );

//       const responseContent = response.data.choices[0].message.content;
//       setMessages(prev => [...prev, { role: "assistant", content: "" }]);
//       streamResponse(responseContent);

//     } catch (error) {
//       console.error("Error:", error);
//       setMessages(prev => [...prev, { 
//         role: "assistant", 
//         content: "Sorry, I encountered an error. Please try again." 
//       }]);
//     }
//     setLoading(false);
//   };


const handleSendMessage = async () => {
    if (!input.trim() && !image) return;
  
    const newMessages = [...messages, { role: "user", content: input, image }];
    setMessages(newMessages);
    setInput("");
    setImage(null);
    setLoading(true);
  
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_LINK,  // USE ENV VAR HERE!
        {
          model: "gpt-4o",
          messages: newMessages,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "api-key": process.env.REACT_APP_API_KEY,  // AND HERE!
          },
        }
      );
  
      const responseContent = response.data.choices[0].message.content;
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);
      streamResponse(responseContent);
  
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again."
      }]);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    return () => {
      if (streamingRef.current) {
        clearTimeout(streamingRef.current);
      }
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
    {/* Header */}
    <header className="chat-header">
      <div className="header-content">
        <h1 className="logo">Tryit!</h1>
        <div className="memory-status">
          <button className="get-it-button">Get it!</button>
        </div>
      </div>
    </header>

    {/* Messages Container */}
   <div className="messages-container">
  <div className="messages-inner">
    {messages.length === 0 && (
      <div className="greeting-message">
        <h2>What are you working on today?</h2>
      </div>
    )}
    
    {messages.map((msg, index) => (
      <div key={index} className={`message ${msg.role}`}>
        <ReactMarkdown>{msg.content}</ReactMarkdown>
      </div>
    ))}
    <div ref={messagesEndRef} />
  </div>
</div>

    {/* Input Area */}
    <div className="input-container">
      <div className="input-wrapper">
        <div className="action-buttons">
          <button className="search-button">Search</button>
          <button className="reason-button">Reason</button>
        </div>
        
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Tryit!"
          disabled={loading}
        />
        
        <button 
          onClick={handleSendMessage} 
          className="send-button"
          disabled={loading}
        >
          {loading ? "..." : "➤"}
        </button>
      </div>
      
      <footer className="disclaimer">
        {/* ChatGPT can make mistakes. Check important info */}
      </footer>
    </div>
  </div>

  );
}

/* Button Styles */
const buttonStyle = {
  backgroundColor: "#444",
  border: "none",
  color: "#bbb",
  padding: "8px",
  borderRadius: "50%",
  cursor: "pointer",
  marginRight: "8px",
};

const textButtonStyle = {
  backgroundColor: "#444",
  border: "none",
  color: "#bbb",
  padding: "8px 12px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "14px",
  marginRight: "8px",
};


const styleSheet = document.createElement("style");
styleSheet.textContent = `
/* Global Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  overflow: hidden;
}

/* Scrollbar Customization */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: transparent;
}

::-webkit-scrollbar-track {
  background: rgba(25, 25, 45, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #7f7fd555, #86a8e755);
  border-radius: 4px;
  border: 1px solid rgba(127, 127, 213, 0.2);
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #7f7fd5, #86a8e7);
}

* {
  scrollbar-width: thin;
  scrollbar-color: #7f7fd5 rgba(25, 25, 45, 0.2);
}

/* Chat Container */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(160deg, #1a1a2e 0%, #16213e 100%);
  color: #e6e6e6;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Header Styles */
.chat-header {
  padding: 16px 24px;
  background: rgba(25, 25, 45, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(45deg, #7f7fd5, #86a8e7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.memory-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.get-it-button {
  background: #7f7fd5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.get-it-button:hover {
  background: #86a8e7;
  transform: translateY(-1px);
}

/* Messages Container */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  scroll-behavior: smooth;
}

.greeting-message {
  text-align: center;
  margin-top: 20vh;
  color: rgba(255, 255, 255, 0.7);
}

.greeting-message h2 {
  font-weight: 400;
  font-size: 24px;
  margin: 0;
  letter-spacing: -0.5px;
}

/* Message Bubbles */
.message {
  max-width: 80%;
  margin: 12px 0;
  padding: 12px 16px;
  border-radius: 8px;
  background: rgba(45, 45, 72, 0.9);
  backdrop-filter: blur(5px);
  line-height: 1.6;
  transition: transform 0.2s ease;
  overflow: hidden;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message:hover {
  transform: translateX(4px);
}

.message.user {
  margin-left: auto;
  background: linear-gradient(135deg, #7f7fd5, #86a8e7);
  color: white;
  border-radius: 8px 8px 0 8px;
}

/* Markdown Content */
.message p {
  margin: 0.5em 0;
}

.message ul, .message ol {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.message li {
  margin: 0.3em 0;
  padding-left: 0.5em;
}

.message strong {
  color: #86a8e7;
}

.message code {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'Fira Code', monospace;
}

/* Input Area */
.input-container {
  padding: 16px 24px;
  background: rgba(25, 25, 45, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  position: sticky;
  bottom: 0;
}

.input-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 4px;
  transition: all 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: #7f7fd5;
  box-shadow: 0 0 0 1px #7f7fd5;
}

.action-buttons {
  display: flex;
  gap: 8px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding-right: 12px;
  margin-right: 12px;
}

.search-button, .reason-button {
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s ease;
}

.search-button:hover, .reason-button:hover {
  background: rgba(127, 127, 213, 0.1);
  color: #86a8e7;
}

input {
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: white;
  font-size: 16px;
}

input:focus {
  outline: none;
}

.send-button {
  background: #7f7fd5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 8px;
}

.send-button:hover {
  background: #86a8e7;
}

/* Responsive Design */
@media (max-width: 768px) {
  .messages-container {
    padding: 16px;
  }

  .input-container {
    padding: 16px;
  }

  .action-buttons {
    display: none;
  }

  input {
    padding: 8px;
    font-size: 14px;
  }

  .message {
    max-width: 90%;
    font-size: 14px;
  }

  .logo {
    font-size: 18px;
  }

  .get-it-button {
    padding: 6px 12px;
  }

  .input-wrapper {
    padding: 2px;
  }
}
`;
document.head.appendChild(styleSheet);


// Add these styles to your existing CSS
const markdownStyles = `
.message {
  /* Existing styles */
  overflow: hidden;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message p {
  margin: 0.5em 0;
  line-height: 1.6;
}

.message ul {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.message li {
  margin: 0.3em 0;
  padding-left: 0.5em;
}

.message strong {
  color: #86a8e7;
}

/* For code blocks (if needed) */
.message code {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'Fira Code', monospace;
}

/* Responsive text sizing */
@media (max-width: 768px) {
  .message {
    font-size: 14px;
  }
  
  .message ul {
    padding-left: 1em;
  }
}
`;
const listStyles = `
.message ol {
  margin: 0.5em 0;
  padding-left: 2em;
  list-style-position: inside;
}

.message li {
  margin: 0.3em 0;
  padding-left: 0.5em;
  text-indent: -1.2em;
}

.message li::marker {
  color: #86a8e7;
  font-weight: bold;
}

/* For mobile */
@media (max-width: 768px) {
  .message ol {
    padding-left: 1.5em;
  }
  
  .message li {
    text-indent: -1em;
  }
}
`;

// Add to existing styles
styleSheet.textContent += listStyles;
// Add to your existing style sheet
// Replace the existing .messages-container styles with:
const scrollbarFix = `
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px 0;
  width: 100%;
  scroll-behavior: smooth;
}

.messages-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (max-width: 768px) {
  .messages-inner {
    padding: 0 16px;
  }
}
`;

// Add to your styleSheet
styleSheet.textContent += scrollbarFix;
styleSheet.textContent += markdownStyles;

document.head.appendChild(styleSheet);