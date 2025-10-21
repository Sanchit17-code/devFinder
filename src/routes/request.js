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


requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const {status, requestId} = req.params;
        if(!["accepted","rejected"].includes(status)){
            throw new Error("this status is not valid");
        }
        const connectionRequest = await ConnectionRequest.findOne({
            status : "interested",
            toUserId: loggedInUser._id,
            _id: requestId
        });
        console.log("connection request is",connectionRequest);
        if(!connectionRequest){
            throw new Error("There is no connection request");
        }
        connectionRequest.status = status;
        const data =  await connectionRequest.save();
        res.json({
            message: "Connection request updated",
            data: data
        })

    }
    catch(e){
        res.status(400).send("ERROR: "+ e.message);
    }
})


module.exports = requestRouter;