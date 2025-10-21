const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")


userRouter.get("/user/requests/recieved", userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName photoUrl age gender about skills")
        console.log("connection requests",connectionRequests);
        if(connectionRequests.length==0){
            res.status(404).json({
                message: "No Connection requests to show"
            })
            return;
        }
        res.json({
            data: connectionRequests
        })
    }
    catch(e){
        res.status(400).send("ERROR: " + e.message)
    }
})


userRouter.get("/user/connections",userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const allowedKeys = "firstName lastName age gender about skills"
        const connections = await ConnectionRequest.find({
            status: "accepted",
            $or:[
                {
                    toUserId: loggedInUser._id
                },
                {
                    fromUserId: loggedInUser._id
                }
            ]
        }).populate("fromUserId", allowedKeys).populate("toUserId",allowedKeys)
        const data = connections.map((connection)=>{
            console.log('connection.fromUserId._id: ', connection.fromUserId._id);
            console.log('loggedInUser._id: ', loggedInUser._id);
            console.log('connection.toUserId: ', connection.toUserId);
            if(connection.fromUserId._id.equals(loggedInUser._id)){  // comparing mongodbIds so best way is to use .equals to compare them okay
                return connection.toUserId
            }
            return  connection.fromUserId
        })
        res.json({
            data
        })
    }
    catch(e){
        res.status(400).send("ERROR: "+ e.message);
    }
})


userRouter.get("/feed",userAuth, async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const page =   parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>20 ? 20 : limit;
        const skip = (page-1) * limit;
        const allowedKeys = "firstName lastName age gender about skills"
        const connectionRequests = await ConnectionRequest.find({
            $or : [
                {
                    toUserId: loggedInUser._id
                },
                {
                    fromUserId: loggedInUser._id
                }
            ]
        })
        const usersIdToBeHiddenInFeed = new Set();
        connectionRequests.forEach(eachReq=>{
            usersIdToBeHiddenInFeed.add(eachReq.toUserId)
            usersIdToBeHiddenInFeed.add(eachReq.fromUserId)
        })
        let usersInFeed = await User.find({
            $and:[
                {
                    _id : { $nin:  Array.from(usersIdToBeHiddenInFeed)}
                },
                {
                    _id : { $ne : loggedInUser._id}
                }
            ]   
        }).select(allowedKeys).skip(skip).limit(limit)
        res.json({
            data : usersInFeed
        })
    }
    catch(e){
        res.status(400).json({message: e.messge})
    }
})




module.exports = userRouter;