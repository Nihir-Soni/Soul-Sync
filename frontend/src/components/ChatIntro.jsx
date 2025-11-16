import React, { useState } from 'react';
import axios from 'axios';
import pp from '../assets/Aurora.png';

const ChatIntro = ({ setChatActive, setChatHistory }) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('authToken');

  const startConversation = async () => {
    setIsLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:5001/api/diary/start-conversation',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Aurora’s first message after reading your diary
      const auroraMessage = res.data.reply;

      // Activate chat mode and show her first message
      setChatHistory([
        {
          role: 'ai',
          message: auroraMessage,
        },
      ]);
      setChatActive(true);
    } catch (err) {
      console.error('Error starting Aurora conversation:', err);
      setChatHistory([
        {
          role: 'ai',
          message:
            "Hmm... I’m having a little trouble reading your diary right now. Maybe try again in a bit?",
        },
      ]);
      setChatActive(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-[220px] h-[340px] flex flex-col items-center justify-center absolute top-[170px] left-[90px] text-white'>
      {/* Aurora's profile image */}
      <div
        className='w-[100px] h-[100px] bg-cover bg-center rounded-full mb-[15px] shadow-[0_0_25px_rgba(255,200,150,0.4)]'
        style={{ backgroundImage: `url(${pp})` }}
      ></div>

      <span className="text-lg font-medium mb-[5px]">Hi, I’m Aurora!</span>
      <span className='text-sm opacity-80 mb-[15px] italic'>
        Your emotional assistant
      </span>

      {/* Thinking / Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center mt-3 space-x-2">
          <div className="w-2 h-2 bg-amber-200 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-amber-300 rounded-full animate-bounce delay-150"></div>
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-300"></div>
          <span className="text-amber-200 text-sm ml-2 animate-pulse">
            Reading your diary...
          </span>
        </div>
      ) : (
        <button
          className="
            relative
            px-6 py-3 
            rounded-lg 
            bg-gradient-to-br from-[#3e2a20] to-[#1e120c]
            text-amber-100 font-semibold tracking-wide
            border border-[#6b4c36]
            shadow-[0_0_10px_rgba(107,76,54,0.3)]
            transition-all duration-300 ease-in-out
            overflow-hidden
            hover:from-[#4d3325] hover:to-[#25160e]
            hover:text-white
            hover:shadow-[0_0_25px_rgba(161,111,64,0.5)]
            active:scale-[0.98] cursor-pointer
          "
          onClick={startConversation}
        >
          <span className="relative z-10">Talk to Aurora about today</span>
          {/* Glowing pulse effect */}
          <span
            className="
              absolute inset-0 rounded-lg
              bg-gradient-to-r from-[#ffce7a20] via-[#ffbb5020] to-[#ffce7a20]
              opacity-0 hover:opacity-100
              blur-md
              animate-[pulseGlow_2s_infinite]
              transition-opacity duration-500
            "
          ></span>
        </button>
      )}
    </div>
  );
};

export default ChatIntro;
