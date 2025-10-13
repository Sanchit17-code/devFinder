const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req,res)=>{
    try{
        const userProfile = req.user;
        res.send(userProfile);
    }
    catch(e){
        res.status(400).send("Error: "+ e.message);
    }
})

module.exports = profileRouter;