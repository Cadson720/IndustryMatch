import React, { useState, useEffect, useRef } from 'react';
import "../styles/matchMaker.css"; // Import the CSS for this component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Loader from '../pages/loader.jsx'; // Import the Loader component
import Header from '../pages/header.jsx'; // Import the Header component

const MatchMakerChat = () => {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I assist you with project searches today?' }
    ]);
    const [projects, setProjects] = useState([]); // Ensure setProjects is defined
    const [loading, setLoading] = useState(true); // Initial loading state
    const chatBoxRef = useRef(null);
    const navigate = useNavigate(); // Initialize useNavigate

    const samplePrompts = [
        "Are there any <span class='bold'>marketing</span> projects I can do <span class='bold'>online</span>?",
        "Show me <span class='bold'>animation</span> projects that are <span class='bold'>12 weeks</span> long",
        "What about a <span class='bold'>journalism</span> project that uses a <span class='bold'>medium</span> sized team?",
        "I want a <span class='bold'>small</span> project that's <span class='bold'>8 weeks</span> long in <span class='bold'>transport engineering</span>",
        "I'm looking for a <span class='bold'>flexible</span> location project to do with <span class='bold'>artificial intelligence</span>"
    ];

    // Simulate initial loading delay of 250ms
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false); // Hide loader after 250ms
        }, 250);
        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, []);

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
            setProjects(projectsData); // Correctly use setProjects
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

    const handleBotMessageClick = async (messageText) => {
        try {
            // Split the message by new lines to separate different parts
            const lines = messageText.split('\n');

            // Extract title from everything before "Industry:"
            const industryIndex = messageText.indexOf("Industry:");
            const keywords = messageText.substring(0, industryIndex).trim(); // Use title as keywords

            // Extract industry and discipline from the second line
            const industryDisciplineLine = lines[1];
            const disciplineMatch = industryDisciplineLine.match(/Discipline: (.*)/);
            const discipline = disciplineMatch ? disciplineMatch[1].trim() : null;

            // Extract duration and size from the third line
            const durationSizeLine = lines[2];
            const durationMatch = durationSizeLine.match(/Duration: (.*) -/);
            const sizeMatch = durationSizeLine.match(/Size: (.*)/);
            const duration = durationMatch ? durationMatch[1].trim() : null;
            const size = sizeMatch ? sizeMatch[1].trim() : null;

            // Extract location_type from the fourth line (or wherever it's defined)
            const locationLine = lines[3]; // Assuming location_type is on the fourth line
            const locationMatch = locationLine.match(/Location: (.*)/);
            const location_type = locationMatch ? locationMatch[1].trim() : null;

            // Debugging: Log extracted variables
            console.log('Extracted keywords:', keywords);
            console.log('Extracted discipline:', discipline);
            console.log('Extracted duration:', duration);
            console.log('Extracted size:', size);
            console.log('Extracted location_type:', location_type);

            // Ensure all required information is extracted
            if (!keywords || !discipline || !duration || !size || !location_type) {
                alert('Could not extract project details from the message.');
                return;
            }

            // Make a GET request to the /project/search route with the extracted parameters
            const searchResponse = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/project/search?keywords=${encodeURIComponent(keywords)}&discipline=${encodeURIComponent(discipline)}&duration=${encodeURIComponent(duration)}&size=${encodeURIComponent(size)}&location_type=${encodeURIComponent(location_type)}`
            );

            if (!searchResponse.ok) throw new Error('Failed to fetch matching project.');

            const projects = await searchResponse.json();

            // Check if projects are found and handle navigation
            if (projects.length > 0) {
                const { project_id } = projects[0]; // Use the first project_id found
                navigate(`/projectDetail?projectId=${project_id}`);
            } else {
                alert('No matching projects found.');
            }
        } catch (error) {
            console.error('Error fetching project:', error);
            alert('Failed to fetch matching project.');
        }
    };

    if (loading) return <Loader />; // Show loader on initial page load

    return (
        <div className="matchmaker-wrapper">
            <Header /> {/* Include the Header component */}
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
                        <div
                            key={index}
                            className={`message ${msg.sender}`}
                            onClick={() => msg.sender === 'bot' && handleBotMessageClick(msg.text)}
                        >
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
