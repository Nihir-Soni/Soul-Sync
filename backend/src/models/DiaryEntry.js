import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "ai"],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const diaryEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  date: {
    type: String, // Example: "2025-11-01"
    required: true
  },

  entryText: {
    type: String,
    default: ""
  },

  chatHistory: [chatMessageSchema],
}, { timestamps: true });

//  one entry per user per date
diaryEntrySchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("DiaryEntry", diaryEntrySchema);
