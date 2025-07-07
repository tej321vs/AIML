// src/components/Chat.jsx
import React, { useState } from 'react';

function Chat({
  chat, onSend, status,
  showMicOptions, setShowMicOptions,
  voiceInput, setVoiceInput, voiceOutput, setVoiceOutput,
  onToggleSidebar
}) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleRegenerate = async (userPrompt) => {
    const chatId = chat._id;
    const res = await fetch("http://localhost:3000/chat/regenerate", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ chatId, userPrompt })
    });

    const data = await res.json();
    const newBotMsg = { type: 'bot', text: data.reply };

    const updatedMessages = [...chat.messages, newBotMsg];
    chat.messages = updatedMessages;

    window.dispatchEvent(new Event('chat-update')); // triggers state update in App
  };

  return (
    <div className="main">
      <button className="sidebar-toggle" onClick={onToggleSidebar}>☰</button>
      <div className="chat-container">
        {chat?.messages.map((m, i) => (
          <div key={i} className={`message ${m.type}`}>
            {m.text}
            {m.type === 'bot' && i > 0 && chat.messages[i - 1].type === 'user' && (
              <div style={{ marginTop: '6px' }}>
                <button onClick={() => handleRegenerate(chat.messages[i - 1].text)}>
                  🔁 Regenerate
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div id="status">{status}</div>
      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="e.g., Perform linear search on [4, 8, 15] to find 15"
        />
        <button onClick={() => setShowMicOptions(true)}>🎤</button>
        <button onClick={handleSend}>➤</button>
        <button onClick={() => window.speechSynthesis.cancel()}>🛑</button>
      </div>
    </div>
  );
}

export default Chat;
