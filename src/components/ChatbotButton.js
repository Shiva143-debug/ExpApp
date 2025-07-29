import React, { useState } from 'react';
import { Tooltip } from 'primereact/tooltip';
import ChatBot from './ChatBot';
import { MdOutlineCancel } from 'react-icons/md';
import { IoChevronDownCircle } from 'react-icons/io5';

const ChatbotButton = () => {
  const [open, setOpen] = useState(false);

  const toggleChat = () => {
    setOpen(prev => !prev);
  };

  return (
    <>
      {/* Floating Chat Icon */}
      {!open && (
        <>
        <Tooltip target=".chatbot-img" content="Need help? Chat with us!" position="left" />
        <img src="/images/chatbot.png" alt="Chatbot" className="chatbot-img" onClick={toggleChat}/>
        </>
      )}

      {/* Floating Chat Window */}
      {open && (
        <div className="chatbot-popup">
          <div className="chatbot-header d-flex justify-content-between align-items-center p-2 border-bottom px-3">
            <h5 className="mb-0">Support Chat</h5>
            <IoChevronDownCircle size={24} className="text-dark cursor-pointer" onClick={toggleChat}/>
          </div>
          <div className="chatbot-body">
            <ChatBot />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotButton;
