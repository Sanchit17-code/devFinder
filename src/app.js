const express = require("express");
const app = express();

app.use("/test",(req,res)=>{
    res.send("hello this is the test route");
})

app.listen(7777,()=>{
    console.log("listening to the port 7777")
})