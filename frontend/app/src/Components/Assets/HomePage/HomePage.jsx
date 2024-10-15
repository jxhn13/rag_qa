import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import MultiplePDFUpload from "../Pdf-Uploads/pdf-upload";
import axios from "axios"; 
import './HomePage.css';

function HomePage() {
    const [chatInput, setChatInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const location = useLocation();
    const { username } = location.state || {};
    const firstChar = username ? username[0] : "";

    const chatDisplayRef = useRef(null); 

    const handleInputChange = (e) => {
        setChatInput(e.target.value);
    };

    const sendMessage = async () => {
        if (!chatInput.trim()) return;

        setMessages(prevMessages => [...prevMessages, { text: chatInput, sender: "user" }]);
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.post('http://localhost:5003/chat', {
                requirements: chatInput,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response Data:', response.data);

            setMessages(prevMessages => [...prevMessages, { text: response.data.output, sender: 'bot' }]);
        } catch (error) {
            console.error('Error fetching chat output:', error);
            setErrorMessage("Failed to fetch response from the server.");
        } finally {
            setLoading(false);
            setChatInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    useEffect(() => {
        if (chatDisplayRef.current) {
            chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-container">
            <div className="side-bar">
                <div className="upperSide">
                    <div className="avatarDiv">
                        <p>{firstChar}</p>
                    </div>
                    <h1 draggable="true">Chat Bot</h1>
                </div>

                <div className="lowerSide">
                    <h1>Upload your files here</h1>
                    <MultiplePDFUpload />
                </div>
            </div>

            <div className="main">
                <div className="chat-display" ref={chatDisplayRef}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`chat-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                        >
                            {message.text}
                        </div>
                    ))}
                    {loading && <div className="chat-message bot-message">Loading...</div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </div>

                <div className="bottom-bar">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type..."
                        disabled={loading} 
                    />
                    <button onClick={sendMessage} disabled={loading}>
                        <i className="material-icons">send</i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
