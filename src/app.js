const express = require("express");
const app = express();

app.use(
    "/user",
    (req,res,next)=>{
        console.log("RH1");
        next();
    },
    (req,res,next)=>{
        console.log("RH2");
        res.send("last route handler")
        next();
    },
)

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