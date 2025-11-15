import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ChatIntro from "./ChatIntro";
import TypingEffect from "./TypingEffect";
import pp from "../assets/Aurora.png";
import chatbg1 from "../assets/chatbg1.png";


const ChatSection = ({ showChat, setShowChat }) => {
  const [chatActive, setChatActive] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatContainerRef = useRef(null);
  const isUserAtBottomRef = useRef(true);
  const token = localStorage.getItem("authToken");

  // keep track if user scrolls away from bottom
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      isUserAtBottomRef.current = distanceFromBottom < 60; // threshold
    };
    el.addEventListener("scroll", onScroll);
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-scroll after chatHistory / isTyping changes, but only if user is at bottom
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el || !isUserAtBottomRef.current) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory, isTyping]);

  // helper to push user message
  const pushUserMessage = (text) => {
    setChatHistory((prev) => [...prev, { role: "user", message: text }]);
  };

  // helper to push AI message as not-complete (will be typed)
  const pushAiMessageForTyping = (text) => {
    setChatHistory((prev) => [...prev, { role: "ai", message: text, isComplete: false }]);
  };

  // mark the last AI message as complete (so it will render full text next time)
  const markLastAiComplete = () => {
    setChatHistory((prev) => {
      const lastAiIndex = (() => {
        for (let i = prev.length - 1; i >= 0; i--) {
          if (prev[i].role === "ai") return i;
        }
        return -1;
      })();
      if (lastAiIndex === -1) return prev;
      const copy = [...prev];
      copy[lastAiIndex] = { ...copy[lastAiIndex], isComplete: true };
      return copy;
    });
  };

  /* ------------------ Start Conversation (Aurora reads diary) ------------------ */
  const startConversation = async () => {
    setChatActive(true);
    setChatHistory([]);
    setIsTyping(true);

    try {
      const res = await axios.post(
        "/api/diary/start-conversation",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const auroraMessage = res.data.reply || "Hello — I’m here.";
      // Push AI message that will type
      pushAiMessageForTyping(auroraMessage);

      // small delay to let UI show typing indicator
      await new Promise((r) => setTimeout(r, 400));
      setIsTyping(true);
    } catch (err) {
      console.error("Error starting Aurora conversation:", err);
      pushAiMessageForTyping(
        "I'm having trouble reading your diary right now... maybe try again in a bit?"
      );
      setIsTyping(false);
    }
  };

  /* ------------------ Send message and request AI reply ------------------ */
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = message.trim();
    pushUserMessage(userMsg);
    setMessage("");
    setIsTyping(true);

    try {
      const res = await axios.post(
        "http://localhost:5001/api/diary/chat",
        { message: userMsg, tempChatHistory: [...chatHistory, { role: "user", message: userMsg }] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiMessage = res.data.reply || "I'm here, listening... can you tell me more?";
      pushAiMessageForTyping(aiMessage);

      // small delay so typing indicator shows
      await new Promise((r) => setTimeout(r, 300));
      setIsTyping(true);
    } catch (err) {
      console.error("Aurora chat error:", err);
      pushAiMessageForTyping("I'm having trouble connecting right now... let's try again shortly.");
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* Helper passed into TypingEffect: scroll while typing (only if user at bottom) */
  const handleTypingProgress = () => {
    const el = chatContainerRef.current;
    if (!el || !isUserAtBottomRef.current) return;
    el.scrollTo({
      top: el.scrollHeight,
    });
  };

  /* Called when TypingEffect finishes for the latest AI message */
  const handleTypingDone = () => {
    // mark last AI message as complete
    markLastAiComplete();
    setIsTyping(false);

    // final scroll (only if user at bottom)
    const el = chatContainerRef.current;
    if (el && isUserAtBottomRef.current) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`
        fixed top-0 left-0 h-full w-[400px]
        transition-transform duration-500 ease-in-out
        ${showChat ? "translate-x-0" : "-translate-x-[390px]"}
        z-40 flex
      `}
    >
      {/* Toggle */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="
          absolute top-1/2 -right-5 transform -translate-y-1/2
          bg-gradient-to-b from-[#4a3326] to-[#2a1c14]
          text-white rounded-full w-10 h-10 flex items-center justify-center
          shadow-lg border border-amber-900/30
          hover:scale-105 active:scale-95 transition-all duration-300
          z-50
        "
      >
        {showChat ? "❮" : "❯"}
      </button>

      <div
        className={`
          h-full w-full flex flex-col p-6 transition-all duration-500
          ${
            chatActive
              ? "border-amber-900/40 shadow-[0_0_25px_rgba(161,111,64,0.3)] bg-cover"
              : "bg-gradient-to-br from-[#2b1e16] via-[#3e2a20] to-[#5c3d2e]"
          }
        `}
        style={chatActive ? { backgroundImage: `url(${chatbg1})` } : {}}
      >
        {chatActive ? (
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto text-black space-y-3 pr-2 custom-scrollbar dancing-script-custom text-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold font-serif">Aurora</h2>
              <span
                className="w-[35px] h-[35px] bg-cover bg-center rounded-full"
                style={{ backgroundImage: `url(${pp})` }}
              />
            </div>

            {/* Messages */}
            {chatHistory.map((chat, idx) => {
              const isLatestAi =
                chat.role === "ai" &&
                !chat.isComplete &&
                // ensure only the very last AI message types
                (() => {
                  for (let i = chatHistory.length - 1; i >= 0; i--) {
                    if (chatHistory[i].role === "ai") return i === idx;
                  }
                  return false;
                })();

              return (
                <div
                  key={idx}
                  className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <p
                    className={`p-3 rounded-lg max-w-[85%] inline-block ${
                      chat.role === "user" ? "bg-amber-600/10 text-gray-900 text-right" : "bg-amber-950/10 text-left"
                    }`}
                  >
                    {isLatestAi ? (
                      <TypingEffect
                        text={chat.message}
                        speed={36}
                        onProgress={handleTypingProgress}
                        onDone={handleTypingDone}
                      />
                    ) : (
                      // If AI message isComplete or user message -> render full text
                      chat.message
                    )}
                  </p>
                </div>
              );
            })}

            {/* Typing indicator (small bouncing dots) */}
            {isTyping && (
              <div className="bg-amber-950/40 text-left p-3 rounded-lg max-w-[85%]">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <ChatIntro onStartChat={startConversation} setChatActive={setChatActive} setChatHistory={setChatHistory} />
        )}

        {/* Input */}
        {chatActive && (
          <div className="mt-4 flex items-center bg-amber-950/30 backdrop-blur-sm rounded-lg border border-amber-900/40 p-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Talk to Aurora..."
              className="flex-1 bg-transparent outline-none px-2 text-amber-100 placeholder:text-amber-300"
            />
            <button onClick={sendMessage} className="ml-2 bg-amber-800 hover:bg-amber-700 px-4 py-2 rounded-md text-white font-semibold transition">
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSection;
