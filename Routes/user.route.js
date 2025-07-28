import express from 'express';
import { userDelete, userLogin, userLogout, userProfile, userResgister, userUpdate } from '../Controller/user.controller.js';

let userRoute = express.Router();

//User Routes :
userRoute.post("/register" , userResgister);
userRoute.post("/login" , userLogin);
userRoute.get("/profile" , userProfile);
userRoute.get("/logout" , userLogout);
userRoute.post("/update" , userUpdate);
userRoute.delete("/delete" , userDelete);


export default userRoute;