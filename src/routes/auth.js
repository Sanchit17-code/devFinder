const express = require("express");
const authRouter = express.Router();
const User = require("../models/user") 
const {signupValidator} = require("../utils/validation")
const bcrypt = require("bcrypt");


authRouter.post("/signup", async (req,res)=>{
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

authRouter.post("/login", async (req,res)=>{
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

authRouter.post("/logout", async (req,res)=>{
    res.cookie("token","",{
        expires: new Date(Date.now())
    })
    res.send("logged out");
})


module.exports = authRouter;