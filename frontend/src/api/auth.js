import axios from "axios";


const API=axios.create({
    baseURL:"http://localhost:5001/api/auth" //backend auth routes

});



export const signupUser = async (data) => API.post("/signup", data);
export const loginUser = async (data) => API.post("/login", data);

