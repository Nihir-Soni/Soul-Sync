# Soul Sync
#### Video Demo: https://youtu.be/Oxt6-XZCcs8
#### Description:

Soul Sync is my final project for CS50, Harvard’s introduction to computer science. It is a full-stack digital diary platform that gives users two ways to reflect on their thoughts: by writing traditional diary entries or by having a conversation with an AI assistant that responds empathetically and helps them process their day. I designed the project to combine journaling with interactive reflection, making it useful both as a personal diary and as a mental organization tool.

Soul Sync is built using the MERN stack: **MongoDB**, **Express**, **React**, and **Node.js**. The backend handles user authentication, secure storage of diary entries, API endpoints, and integration with an AI model. The frontend provides a smooth, responsive interface where users can write entries, view their history, or chat with the assistant. Security is handled using **JWT**, while passwords are hashed using **bcrypt** before storage.

---

## Project Overview

The main purpose of Soul Sync is to give users a simple but meaningful space where they can write or talk about their day without judgment. Many people struggle to maintain a diary or express emotions clearly, so the AI assistant helps guide them by asking follow-up questions or prompting them to think deeper. All entries and conversations are private to the user and stored securely.

From a technical perspective, Soul Sync demonstrates important computer science concepts taught in CS50: persistent storage, secure authentication, APIs, asynchronous programming, and interactive UI design. The project is also modular, making it easy to extend — for example, adding tags, mood tracking, or exporting entries in the future.

---

## File and Folder Structure

Below is a detailed explanation of the files and folders I created and what each of them does:

### **/backend/**
This is the Node.js + Express server.

- **server.js (or index.js):**
  The main entry point of the backend. It connects to MongoDB, sets up Express, loads middleware, registers routes, and starts the server listening on a chosen port.

- **/routes/**
  Contains Express route handlers for authentication and diary entry operations.
  - `auth.js` handles login, registration, token validation, and authentication middleware.
  - `entries.js` handles viewing, creating, deleting, and updating diary entries.

- **/models/**
  Mongoose schemas for MongoDB:
  - `User.js` defines user fields like email, hashed password, and timestamps.
  - `Entry.js` defines diary entry fields such as content, date, and owner.

- **/controllers/** (if included)
  Functions used by the routes to separate logic cleanly.

- **/middleware/auth.js**
  A JWT verification middleware that ensures only logged-in users can access certain routes.

- **package.json**
  Lists backend dependencies such as express, mongoose, bcrypt, cors, and jsonwebtoken.

- **.env.example**
  A sample environment variable file (does NOT contain real secrets), showing the variables needed to run the backend such as JWT_SECRET and MONGO_URI.

---

### **/frontend/**
This is the React application.

- **src/App.js:**
  Main routing and page structure.

- **src/components/**
  All reusable UI components:
  - Navigation bar
  - Diary entry UI
  - History viewer
  - Chat section for AI conversation
  - Form components like Login, Signup, etc.

- **src/pages/**
  Page-level components such as LoginPage, SignupPage, DiaryPage, and ChatPage.

- **src/utils/**
  Helper functions like Axios instances or auth utilities.

- **src/assets/**
  Images, icons, or background graphics.

- **package.json**
  Contains frontend dependencies like react, axios, lucide-react, and scripts such as `"start"`.

---

## Design Choices

### **1. MERN Stack**
I chose MERN because it allows me to use JavaScript across the entire project. This made development faster and let me reuse logic and patterns between backend and frontend.

### **2. JWT Authentication**
Instead of sessions, I used JWT because:
- It is stateless (no session storage on server),
- Works easily with APIs,
- Fits modern single-page apps well.

### **3. Bcrypt for Passwords**
I used bcrypt for hashing because it is secure, industry-standard, and recommended for storing passwords.

### **4. AI Assistant Integration**
The AI assistant is optional but adds a unique feature. Users who don’t like writing paragraphs can simply chat instead. I intentionally separated AI interaction logic so it can be replaced or improved without changing the whole system.

### **5. Minimalist UI**
I kept the UI simple, readable, and responsive. Diary apps should feel calming, not overwhelming.

---

## How to Run the Project

### **Backend**
```
cd backend
npm install
npm run dev
```

You will need a `.env` file containing:

```
MONGO_URI=<your_mongo_url>
JWT_SECRET=<your_secret>
```

### **Frontend**
```
cd frontend
npm install
npm start
```

The frontend communicates with the backend via Axios requests.

---

## What I Learned

Building Soul Sync helped me apply almost everything I learned in CS50:

- Managing a full-stack project from scratch
- Designing and documenting REST APIs
- Handling secure authentication
- Structuring a React application
- Using MongoDB with Mongoose
- Integrating an AI model into a web application
- Debugging both client-side and server-side issues
- Thinking about user experience and design
- Writing clear documentation
- Testing features and validating routes

This project challenged me to think like an engineer, make design decisions, and structure my code cleanly. It also taught me how important good documentation is — especially for larger projects.

---

## Author
**Nihir**
GitHub: **Nihir-Soni**
edX: **Nihir Soni**
Location: **Bangalore, India**
