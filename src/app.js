const express = require("express");
const {isAdminAuth, isUserAuth} = require("./middlewares/auth");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user") 


app.post("/signup", async (req,res)=>{
    const userData = {
        firstName: "Sanchit",
        lastName: "Agrawal",
        emailId: "sanchitagrwal429@gmail.com",
        age: 28,
        password: "sanchit#1234",
        random: "random data to test something"
    }
    const user = new User(userData)
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
