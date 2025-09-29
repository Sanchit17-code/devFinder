const express = require("express");
const {isAdminAuth, isUserAuth} = require("./middlewares/auth");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user") 

app.use(express.json());

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
.catch(()=>{
    console.log("Not able to connect to DB");
})
