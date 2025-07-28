import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';

import userRoute from './Routes/user.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URL , {
    dbName : "User_Authentication",
}).then(() => {
    console.log(chalk.bgBlack.cyan("MongoDB Connected ..."));
}).catch((err) => {
    console.error(err);
})


let port = process.env.PORT || 4000
let server = express();

server.use(express.json());
server.use(express.urlencoded({extended : true}));
server.use(cookieParser());

//Server Routing :
server.get('/' , (req , res) => {
    res.send("api is Working ...")
})


//user Routes :
server.use("/api/user" , userRoute);


//Server Port :
server.listen(port , () => {
    console.log(chalk.yellow(`Server Running at port in : ${port}`));
})