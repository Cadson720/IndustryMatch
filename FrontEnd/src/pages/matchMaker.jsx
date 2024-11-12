import React, { useState, useEffect, useRef } from 'react';
import "../styles/matchMaker.css"; // Import the CSS for this component

const MatchMakerChat = () => {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I assist you with project searches today?' }
    ]);
    const [projects, setProjects] = useState([]);
    const chatBoxRef = useRef(null);

    const samplePrompts = [
        "Are there any <span class='bold'>marketing</span> projects I can do <span class='bold'>online</span>?",
        "Show me <span class='bold'>animation</span> projects that are <span class='bold'>12 weeks</span> long",
        "What about a <span class='bold'>journalism</span> project that uses a <span class='bold'>medium</span> sized team?",
        "I want a <span class='bold'>small</span> project that's <span class='bold'>8 weeks</span> long in <span class='bold'>transport engineering</span>",
        "I'm looking for a <span class='bold'>flexible</span> location project to do with <span class='bold'>artificial intelligence</span>"
    ];

    // Function to handle sending messages to the bot
    const sendMessage = async (message) => {
        if (!message || message.trim() === '') return; // Prevent sending empty messages

        // Display user's message
        setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: message }]);

        try {
            const response = await fetch(`${import.meta.env.VITE_AI_API_BASE_URL}/webhooks/rest/webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender: 'user',
                    message: message
                })
            });

            if (!response.ok) throw new Error('Failed to communicate with the bot.');

            const data = await response.json();
            const botMessages = data.filter(d => !d.projects).map((message) => ({
                sender: 'bot',
                text: message.text
            }));

            // Extract projects from bot response if available
            const projectsData = data.find(d => d.projects)?.projects || [];

            setMessages((prevMessages) => [...prevMessages, ...botMessages]);
            setProjects(projectsData);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: 'There was an issue connecting to the bot.' }]);
        }

        // Clear input after sending
        setInputText('');
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(inputText);
    };

    // Function to handle clicking a sample prompt
    const handleSamplePromptClick = (prompt) => {
        const plainTextPrompt = prompt.replace(/<[^>]+>/g, '');
        sendMessage(plainTextPrompt);
    };

    // Effect to handle auto-scrolling
    useEffect(() => {
        const chatBox = chatBoxRef.current;
        if (chatBox) {
            // Scroll to the bottom
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="matchmaker-wrapper">
            <div className="matchmaker-chat">
                <div className="chat-box" ref={chatBoxRef}>
                    <div className="sample-prompts">
                        {samplePrompts.map((prompt, index) => (
                            <div
                                key={index}
                                className="sample-prompt"
                                onClick={() => handleSamplePromptClick(prompt)}
                                dangerouslySetInnerHTML={{ __html: prompt }}
                            ></div>
                        ))}
                    </div>
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
