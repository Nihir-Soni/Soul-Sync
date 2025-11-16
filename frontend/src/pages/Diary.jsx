import React, { useState, useEffect } from 'react';
import axios from 'axios';
import diary_bg from '../assets/pagebg.png';
import ChatSection from '../components/ChatSection';
import DiaryHistory from '../components/DiaryHistory';

const Diary = () => {
  const [showChat, setShowChat] = useState(false);
  const [chatActive, setChatActive] = useState(false); // for glass effect mode
  const [entryText, setEntryText] = useState('');
  const [saving, setSaving] = useState(false);
   const [showHistory, setShowHistory] = useState(false);

  const token = localStorage.getItem('authToken');

  //  Format the date
  const getFormattedDate = () => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  };

  //  Auto-save logic (runs after 2s of no typing)
  useEffect(() => {
    if (!entryText.trim()) return; // Don't autosave if empty

    const timeout = setTimeout(async () => {
      try {
        setSaving(true);
        await axios.patch(
          'http://localhost:5001/api/diary/today',
          { entryText },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('✅ Auto-saved diary entry.');
      } catch (err) {
        console.error('❌ Auto-save failed:', err);
      } finally {
        setSaving(false);
      }
    }, 2000);

    return () => clearTimeout(timeout);//The timeout variable holds the ID of this timer, which is crucial for canceling it.
  }, [entryText]);

  //  Fetch today's diary entry on mount
  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/diary/today', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data.entryText) setEntryText(res.data.entryText);
      } catch (error) {
        console.error('Error fetching today’s entry:', error);
      }
    };
    fetchEntry();
  }, [token]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-y-scroll">
      {/* Diary Page */}
      <div
        className="relative bg-cover bg-center shadow-lg"
        style={{
          backgroundImage: `url(${diary_bg})`,
          width: '100%',
          height: '1500px',
        }}
      >
        {/* Date Display */}
        <div className="absolute top-[240px] right-[380px] text-amber-900 font-serif text-base italic">
          {getFormattedDate()}
        </div>

        {/* Text Area */}
        <textarea
          value={entryText}
           spellCheck={false}
          onChange={(e) => setEntryText(e.target.value)}
          className="absolute top-[340px] left-[380px] w-[630px] h-[850px] bg-transparent outline-none text-3xl leading-normal resize-none overflow-y-auto font-bold italic text-gray-800 no-scrollbar 
          dancing-script-custom "
          placeholder="Dear Diary..."
        />

        {/* Saving Indicator */}
        {saving && (
          <div className="absolute bottom-[230px] left-[380px] text-sm text-amber-800 italic animate-pulse">
            Saving...
          </div>
        )}
      </div>

      {/* Chat Section */}
      <ChatSection
        showChat={showChat}
        setShowChat={setShowChat}
        chatActive={chatActive}
        setChatActive={setChatActive}
      />

       {/* Right - Diary History */}
      <DiaryHistory showHistory={showHistory} setShowHistory={setShowHistory} />
    </div>
  );
};

export default Diary;
