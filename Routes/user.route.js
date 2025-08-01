import express from 'express';
import { getAllProfile, userDelete, userLogin, userLogout, userProfile, userResgister, userUpdate } from '../Controller/user.controller.js';
import { isAdmin } from '../Middlewere/userAuth.js';

let userRoute = express.Router();

//User Routes :
userRoute.post("/register" , userResgister);
userRoute.post("/login" , userLogin);

//Curd operation : 
userRoute.get("/profile" , userProfile);
userRoute.get("/logout" , userLogout);
userRoute.post("/update" , userUpdate);
userRoute.delete("/delete" , userDelete);
userRoute.get("/getalluser" , isAdmin , getAllProfile);


export default userRoute;