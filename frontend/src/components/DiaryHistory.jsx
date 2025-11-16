import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, CalendarDays } from "lucide-react";

const DiaryHistory = ({ showHistory, setShowHistory }) => {
  const [history, setHistory] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("authToken");

  // Fetch all diary entries
  useEffect(() => {
    if (!showHistory) return;
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/diary/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(Array.isArray(res.data) ? res.data : res.data.entries || []);

      } catch (err) {
        console.error("Error fetching diary history:", err);
      }
    };
    fetchHistory();
  }, [showHistory, token]);

  //  Fetch a specific entry
  const viewEntry = async (date) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/diary/${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedEntry(res.data);
    } catch (err) {
      console.error("Error fetching entry:", err);
    } finally {
      setLoading(false);
    }
  };

  //  Delete entry
  const deleteEntry = async (date) => {
    if (!window.confirm("Delete this diary entry permanently?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/diary/${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(history.filter((h) => h.date !== date));
      if (selectedEntry?.date === date) setSelectedEntry(null);
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[420px] z-40 transition-transform duration-500 ease-in-out
      ${showHistory ? "translate-x-0" : "translate-x-[407px]"}`}
    >
      {/* Toggle Arrow Button */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="absolute top-1/2 -left-5 transform -translate-y-1/2
        bg-gradient-to-b from-[#4a3326] to-[#2a1c14] text-white rounded-full w-10 h-10 flex items-center justify-center
        shadow-lg border border-amber-900/30 hover:scale-105 active:scale-95 transition-all duration-300 z-50"
      >
        {showHistory ? "❯" : "❮"}
      </button>

      {/* History Panel */}
      <div className="h-full w-full backdrop-blur-md bg-white/10 border-l border-amber-900/40 shadow-[0_0_25px_rgba(161,111,64,0.3)] p-6 flex flex-col text-amber-100 transition-all duration-500 overflow-hidden">
        <h2 className="text-2xl font-semibold text-center mb-4 flex items-center justify-center gap-2">
          <CalendarDays size={22} /> Diary History
        </h2>

        <div className="flex-1 flex overflow-hidden gap-4">
          {/* Left side - Dates */}
          <div className="w-[45%] overflow-y-auto pr-2 border-r border-amber-900/40">
            {history.length === 0 ? (
              <p className="text-amber-200 italic mt-4 text-center">No entries yet...</p>
            ) : (
              <ul className="space-y-3">
                {history.map((entry) => (
                  <li
                    key={entry.date}
                    className={`flex justify-between items-center bg-amber-900/30 hover:bg-amber-900/50 rounded-lg p-2 cursor-pointer transition ${
                      selectedEntry?.date === entry.date ? "bg-amber-900/60" : ""
                    }`}
                  >
                    <span onClick={() => viewEntry(entry.date)} className="text-sm font-medium">
                      {entry.date}
                    </span>
                    <button
                      onClick={() => deleteEntry(entry.date)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right side - Entry Text */}
          <div className="flex-1 overflow-y-auto p-3 rounded-lg bg-amber-950/20 border border-amber-900/40">
            {loading ? (
              <p className="italic text-amber-200">Loading entry...</p>
            ) : selectedEntry ? (
              <>
                <h3 className="text-lg font-semibold mb-2">{selectedEntry.date}</h3>
                <p className="text-amber-100 whitespace-pre-wrap leading-relaxed">
                  {selectedEntry.entryText}
                </p>
              </>
            ) : (
              <p className="text-amber-300 italic text-center mt-10">
                Select a date to read that day's diary.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryHistory;
