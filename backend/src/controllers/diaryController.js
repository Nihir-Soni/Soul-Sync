import DiaryEntry from "../models/DiaryEntry.js";
import User from "../models/User.js"; 
import { auroraPrompt } from "../prompts/auroraPrompt.js";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


/* 🪶  Get or Create Today's Diary Entry   */

export const getOrCreateTodayEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = new Date().toISOString().split("T")[0];

    let entry = await DiaryEntry.findOne({ user: userId, date });

    if (!entry) {
      entry = await DiaryEntry.create({
        user: userId,
        date,
        entryText: "",
      });
    }

    res.status(200).json(entry);
  } catch (error) {
    console.error("Error in getOrCreateTodayEntry:", error);
    res.status(500).json({ message: "Error fetching today's entry" });
  }
};


/*  Auto-Save Diary Entry                                               */

export const updateDiaryEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { entryText } = req.body;
    const date = new Date().toISOString().split("T")[0];

    if (!entryText && entryText !== "") {
      return res.status(400).json({ message: "entryText is required" });
    }

    const updatedEntry = await DiaryEntry.findOneAndUpdate(
      { user: userId, date },
      { entryText },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Diary entry auto-saved", updatedEntry });
  } catch (error) {
    console.error("Error in updateDiaryEntry:", error);
    res.status(500).json({ message: "Error auto-saving diary entry" });
  }
};


/* Get diary entry by specific date                                    */

export const getDiaryEntryByDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.params;

    const entry = await DiaryEntry.findOne({ user: userId, date });
    if (!entry) return res.status(404).json({ message: "No entry found for this date" });

    res.status(200).json(entry);
  } catch (error) {
    console.error("Error fetching diary entry:", error);
    res.status(500).json({ message: "Error fetching diary entry" });
  }
};

/*  Delete diary entry by date                                          */
export const deleteDiaryEntryByDate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.params;

    const deleted = await DiaryEntry.findOneAndDelete({ user: userId, date });
    if (!deleted) return res.status(404).json({ message: "No entry found to delete" });

    res.status(200).json({ message: "Diary entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting diary entry:", error);
    res.status(500).json({ message: "Error deleting diary entry" });
  }
};


/*  Add Chat Message (Temporary Chat Only)                              */

export const addChatMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { message, tempChatHistory = [] } = req.body;

    const date = new Date().toISOString().split("T")[0];
    const entry = await DiaryEntry.findOne({ user: userId, date });
    const user = await User.findById(userId).select("name");

    if (!entry) {
      return res.status(404).json({ message: "No diary entry found for today" });
    }

    const userName = user?.name || "friend";

    const systemPrompt = `
${auroraPrompt}

📔 Diary Entry by ${userName}:
"${entry.entryText || "(No diary text written yet)"}"

Now continue this ongoing conversation naturally, responding as Aurora — empathetic, emotionally aware, and warm.
`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...tempChatHistory.map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.message,
      })),
      { role: "user", content: message },
    ];

    const aiResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.8,
    });

    const aiMessage =
      aiResponse.choices?.[0]?.message?.content?.trim() ||
      "I'm here, listening... could you tell me a bit more?";

    res.status(200).json({ reply: aiMessage });
  } catch (error) {
    console.error("Error in addChatMessage:", error);
    res.status(500).json({ message: "Error generating Aurora's reply" });
  }
};

/*  Aurora Starts the Chat (Reads Diary Entry First)                    */

export const startAuroraConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = new Date().toISOString().split("T")[0];

    const user = await User.findById(userId).select("name");
    const userName = user?.name || "friend";

    const entry = await DiaryEntry.findOne({ user: userId, date });

    //  If no entry yet, greet the user gently by name
    if (!entry || !entry.entryText.trim()) {
      const defaultGreeting = `Hey there, ${userName}. I noticed you haven’t written anything yet — want to tell me how your day went?`;
      return res.status(200).json({ reply: defaultGreeting });
    }

    // Aurora reads the diary entry and starts the conversation
    const systemPrompt = `
${auroraPrompt}

You are Aurora — a reflective, kind AI companion who has just read ${userName}'s diary entry for today.
Start the conversation first. Speak softly, show warmth and understanding, and respond to the tone of the diary.

📔 ${userName}’s Diary Entry:
"${entry.entryText}"

Compose your first message as Aurora:
`;

    const aiResponse = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: systemPrompt }],
      temperature: 0.85,
    });

    const aiMessage =
      aiResponse.choices?.[0]?.message?.content?.trim() ||
      `I just finished reading your diary, ${userName}... it felt peaceful today. Would you like to talk about it?`;

    res.status(200).json({ reply: aiMessage });
  } catch (error) {
    console.error("Error in startAuroraConversation:", error);
    res.status(500).json({ message: "Error starting conversation with Aurora." });
  }
};

/*  Get User’s Diary History                                           */

export const getDiaryHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = await DiaryEntry.find({ user: userId })
      .select("date createdAt")
      .sort({ date: -1 });

    res.status(200).json(entries);
  } catch (error) {
    console.error("Error in getDiaryHistory:", error);
    res.status(500).json({ message: "Error fetching diary history" });
  }
};
