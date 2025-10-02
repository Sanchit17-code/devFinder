const express = require("express");
const {isAdminAuth, isUserAuth} = require("./middlewares/auth");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user") 

app.use(express.json());

app.get("/user", async (req,res)=>{
    const emailId = req.body.emailId;
    console.log("emilID",emailId);
    try{
        const users = await User.find({emailId: emailId});
        if(users.length>0){
            res.send(users)
        }
        else{
            res.status(404).send("No Users Found")
        }
    }
    catch(err){
        res.status.send(400).send("Something went wrong");
    }

})


app.delete("/user", async (req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("Deleted")
    }
    catch(err){
        res.status(400).send("Error in deleting the user");
    }
})

app.patch("/user",async (req,res)=>{
    const userId = req.body.userId;
    const options = {
        returnDocument : "after"
    }
    try{
        const user = await User.findByIdAndUpdate(userId,req.body, options)
        res.send(user);
    }
    catch(err){
         res.status(400).send("Error in updating the user");
    }
})

app.get("/feed", async (req,res)=>{
    try{
        const users = await User.find({})
        if(users.length>0){
            res.send(users);
        }
        else{
            res.status(404).send("No users found")
        }
    }
    catch(err){
        res.status(400).send("Somehting went wrong");
    }
})

app.post("/signup", async (req,res)=>{
    console.log("req.body",req.body);
    const user = new User(req.body)
    try{
        await user.save();
        res.send("user added successfully");
    }
    catch(err){
        res.status(400).send("there is error in adding the user");
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
