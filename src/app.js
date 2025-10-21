const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser")

const profileRouter = require("./routes/profile")
const authRouter = require("./routes/auth")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")
app.use(express.json());
app.use(cookieParser())

app.use("/",profileRouter);
app.use("/",authRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

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
