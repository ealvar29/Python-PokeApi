import React, { useState } from "react";
import OpenAI from "openai";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // For Vite, use import.meta.env instead of process.env
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Note: VITE_ prefix!
    dangerouslyAllowBrowser: true,
  });

  // Function to send message to ChatGPT
  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { role: "user", content: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const botResponse = await response.json();
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I had trouble understanding that. Please try again!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <h2>🤖 My AI Assistant</h2>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === "user" ? "user" : "bot"}`}
          >
            <div className="message-icon">
              {message.role === "user" ? "👤" : "🤖"}
            </div>
            <div className="message-content">{message.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="message bot">
            <div className="message-icon">🤖</div>
            <div className="message-content">Thinking... 💭</div>
          </div>
        )}
      </div>

      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message here..."
          className="message-input"
        />
        <button onClick={sendMessage} className="send-button">
          📤 Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
