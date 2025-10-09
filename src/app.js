const express = require("express");
const {userAuth} = require("./middlewares/auth");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user") 
const {signupValidator} = require("./utils/validation")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")
app.use(express.json());
app.use(cookieParser())



app.post("/login", async (req,res)=>{
    try{
        const {emailId, password} = req.body;
        const user = await  User.findOne({emailId: emailId})
        if(!user){
            throw new Error("Invalid Credentials");
        }
        const isPasswordMatching = await user.validatePassword(password)
        if(!isPasswordMatching){
            throw new Error("Invalid Credentials");
        }
        else{

            const token = user.getJWT();
            console.log("token",token);
            res.cookie("token",token, {
                expires: new Date(Date.now() + 8 * 3600000),    // even the cookie can be expired and not just the token
            });
            res.send("Welcome " + user.firstName);
        }
    }
    catch(err){
        res.status(400).send("Error: " + err.message)
    }
})

app.get("/profile", userAuth, async (req,res)=>{
    try{
        const userProfile = req.user;
        res.send(userProfile);
    }
    catch(e){
        res.status(400).send("Error: "+ e.message);
    }
})

app.get("/sendConnectionRequest",userAuth,async(req,res)=>{
    const user = req.user;
    res.send(user.firstName +" has sent the connection request!!!")
})

app.post("/signup", async (req,res)=>{
    // console.log("req.body",req.body);
    try{
        signupValidator(req)
        const {firstName,lastName,emailId,password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        console.log(passwordHash);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        })
        await user.save();
        res.send("user added successfully");
    }
    catch(err){
        console.log(err);
        res.status(400).send("Error: " + err.message);
    }
})



connectDB()
.then(()=>{
    console.log("DB connected successfully");
    app.listen(7777,()=>{
        console.log("listening to the port 7777")
    })
})
.catch((err)=>{
    console.log("Not able to connect to DB",err);
})
