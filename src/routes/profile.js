const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User  = require("../models/user");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req,res)=>{
    try{
        const userProfile = req.user;
        res.send(userProfile);
    }
    catch(e){
        res.status(400).send("Error: "+ e.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        console.log("loggedIn user",loggedInUser);
        Object.keys(req.body).forEach(eachField=>{
            loggedInUser[eachField] = req.body[eachField];
        })
        await loggedInUser.save();
        console.log("loggedIn user",loggedInUser);
        res.json({
            message: "Data has been updated",
            data: loggedInUser
        })
    }
    catch(e){
        res.status(400).send("ERROR: "+ e.message);
    }
})

profileRouter.patch("/profile/password", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const {emailId, oldPassword, newPassword} = req.body;
        const isPasswordMatching = await loggedInUser.validatePassword(oldPassword);
        if(!isPasswordMatching){
            throw new Error("Error: old password is not matching");
        }
        const passwordHash = await bcrypt.hash(newPassword,10);
        loggedInUser.password = passwordHash;
        loggedInUser.save();

        res.send("Password changed successfully")
        

    }catch(err){
        res.status(400).send("ERROR: ",err.message);
    }
})

module.exports = profileRouter;