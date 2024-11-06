import React, { useState } from 'react';
import "../styles/matchMaker.css"; // Import the CSS for this component
import axios from 'axios';

const MatchMakerChat = () => {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I assist you with project searches today?' }
    ]);

    // Function to handle sending messages to the bot
    const sendMessage = async () => {
        if (inputText.trim() === '') return; // Prevent sending empty messages

        // Display user's message
        setMessages([...messages, { sender: 'user', text: inputText }]);

        try {
            const response = await axios.post('http://159.196.147.89:5005/webhooks/rest/webhook', {
                sender: 'user',
                message: inputText
            });

            // Process bot responses and update messages
            const botMessages = response.data.map((message) => ({
                sender: 'bot',
                text: message.text
            }));
            setMessages((prevMessages) => [...prevMessages, ...botMessages]);

        } catch (error) {
            console.error('Error sending message:', error);
            setMessages([...messages, { sender: 'bot', text: 'There was an issue connecting to the bot.' }]);
        }

        // Clear input after sending
        setInputText('');
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    return (
        <div className="matchmaker-wrapper"> {/* Fullscreen background wrapper */}
            <div className="matchmaker-chat">
                <h1>Chat with the MatchMaker Bot</h1>
                
                <div className="chat-box">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                
                <form onSubmit={handleSubmit} className="chat-input">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your message here..."
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
};

export default MatchMakerChat;
