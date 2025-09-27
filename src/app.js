const express = require("express");
const {isAdminAuth, isUserAuth} = require("./middlewares/auth")
const app = express();


app.use("/admin",isAdminAuth);

app.get("/user/data",isUserAuth,(req,res,next)=>{
    res.send("user data is here")
})

app.get("/user/login",(req,res,next)=>{
    res.send("welcome to /login route handler");
})

app.get("/admin/getAllData",(req,res,next)=>{
    res.send("welcome to admin all data");
})

app.get("/getUserData",(req,res,next)=>{
    console.log("inside the getUserdata route")
    const error =  new Error("ewfjnwefj");
    next(error);
    // res.send("User data sent");
})

app.use("/",(err,req,res,next)=>{
    if(err){
        console.log("encounter an error");
        res.status(500).send("something went wrong");
    }
})


// app.get("/test",(req,res)=>{
//     res.send("hello this is the test route");
// })
// app.get("/test/random",(req,res)=>{
//     console.log(req.query);
//     res.send("hello this is the test and random route");
// })
// app.get("/user/:userId",(req,res)=>{
//     console.log(req.params);
//     res.send("hello this is the user with user id");
// })

app.listen(7777,()=>{
    console.log("listening to the port 7777")
})