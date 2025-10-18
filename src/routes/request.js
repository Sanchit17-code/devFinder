const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")

requestRouter.post("/request/sent/:status/:toUserId",userAuth,async(req,res)=>{

    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const toUser = await User.findOne({_id: toUserId});
        if(!toUser){
            throw new Error("User Does not Exist");
        }
        if(!["interested","ignored"].includes(status)){
             throw new Error("Wrong status type sent");
        }
        const isConnectionRequestSent = await ConnectionRequest.findOne({
            $or:[
                {
                    fromUserId, toUserId
                },
                {
                    toUserId: fromUserId, 
                    fromUserId: toUserId
                },
            ]
        });
        if(isConnectionRequestSent){
            throw new Error("connection request already exists between you two");
        }
        const newRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        await newRequest.save();
        res.json({
            data: newRequest,
            message: "connection request sent sucessfully"
        })
    }
    catch(e){
        res.status(400).send("ERROR: "+ e.message);
    }
    
})


module.exports = requestRouter;