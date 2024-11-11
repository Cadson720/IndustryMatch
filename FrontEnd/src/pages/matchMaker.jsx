import React, { useState } from 'react';
import "../styles/matchMaker.css"; // Import the CSS for this component

const MatchMakerChat = () => {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I assist you with project searches today?' }
    ]);

    const samplePrompts = [
        "Are there any marketing projects I can do online?",
        "Show me animation projects that are 12 weeks long",
        "What about a journalism project to do with interviewing that uses a medium-sized team?",
        "I want a small project that's 8 weeks long in transport engineering"
    ];

    // Function to handle sending messages to the bot
    const sendMessage = async () => {
        if (inputText.trim() === '') return; // Prevent sending empty messages

        // Display user's message
        setMessages([...messages, { sender: 'user', text: inputText }]);

        try {
            const response = await fetch(`${import.meta.env.VITE_AI_API_BASE_URL}/webhooks/rest/webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender: 'user',
                    message: inputText
                })
            });

            if (!response.ok) throw new Error('Failed to communicate with the bot.');

            const data = await response.json();
            const botMessages = data.map((message) => ({
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

    // Function to handle clicking a sample prompt
    const handleSamplePromptClick = (prompt) => {
        setInputText(prompt); // Set the input field to the clicked prompt
    };

    return (
        <div className="matchmaker-wrapper">
            <div className="sample-prompts">
                {samplePrompts.map((prompt, index) => (
                    <div
                        key={index}
                        className="sample-prompt"
                        onClick={() => handleSamplePromptClick(prompt)}
                    >
                        {prompt}
                    </div>
                ))}
            </div>

            <div className="matchmaker-chat">
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
