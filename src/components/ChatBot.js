
import { useEffect, useState } from "react";
import { IoSendSharp } from "react-icons/io5";

const ChatBot = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState([]);

    // Load messages from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('chatMessages');
        if (stored) {
            setMessages(JSON.parse(stored));
        }
    }, []);

    // Save to localStorage whenever messages change
    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        const newMessages = [...messages, { type: 'user', text: prompt }];
        setMessages(newMessages);
        setLoading(true);
        setError(null);
        setPrompt('');

        try {
            const res = await fetch('https://backend-exp-1.onrender.com/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) throw new Error('Network response was not ok');

            const data = await res.json();
            setMessages(prev => [...prev, { type: 'bot', text: data.message || '' }]);
        } catch (err) {
            setError("Smething went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-container d-flex flex-column h-100">
            {/* Chat messages */}
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chatbot-message ${msg.type === 'user' ? 'user' : 'bot'}`}
                        dangerouslySetInnerHTML={{
                            __html: msg.text
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/^(\d+)\.\s/gm, '<strong>$1.</strong> ')
                        }}
                    ></div>
                ))}

                {loading && <p className="text-muted">Thinking...</p>}
                {error && <p className="text-danger">{error}</p>}

                {messages.length === 0 && (
                    <div className="text-center text-muted">
                        <p>Start the conversation by typing a message.</p>
                        <p>You can ask me anything!</p>
                    </div>
                )}
            </div>

            {/* Input form */}
            <form onSubmit={handleSubmit} className="chatbot-input">
                <div className="d-flex">
                    <input type="text" className="form-control me-2" placeholder="Type your message..." value={prompt} onChange={(e) => setPrompt(e.target.value)}/>
                    <button type="submit" className="btn btn-primary">
                        <IoSendSharp size={20} />
                    </button>
                </div>
            </form>
        </div>
    );

};

export default ChatBot;
