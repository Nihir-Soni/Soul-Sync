import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "../config/db.js";
import diaryRoutes from "./routes/diaryRoutes.js";
import authRoutes from "./routes/authRoutes.js";



dotenv.config();
connectDB();

const app=express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/diary",diaryRoutes);


app.get("/",(req,res)=>{
    res.send("Soul Sync is running.....");
})





const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server running on port:${PORT}`));