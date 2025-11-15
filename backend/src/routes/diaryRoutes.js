import express from "express";
import {
  getOrCreateTodayEntry,
  addChatMessage,
  getDiaryHistory,
  startAuroraConversation,
   getDiaryEntryByDate,
  deleteDiaryEntryByDate
} from "../controllers/diaryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { updateDiaryEntry } from "../controllers/diaryController.js";


const router = express.Router();

router.get("/today", authMiddleware, getOrCreateTodayEntry);
router.post("/chat", authMiddleware, addChatMessage);
router.post("/start-conversation", authMiddleware, startAuroraConversation); // ✅ must exist
router.get("/history", authMiddleware, getDiaryHistory);
router.patch("/today", authMiddleware, updateDiaryEntry);
router.get("/:date", authMiddleware, getDiaryEntryByDate);   // 🆕 View entry by date
router.delete("/:date", authMiddleware, deleteDiaryEntryByDate); // 🆕 Delete entry


export default router;
