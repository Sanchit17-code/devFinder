const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req,res,next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
            throw new Error("Not Logged In")
        }
        const decoded = jwt.verify(token,"somePrivateKey#1244");
        const userId = decoded._id;
        const user = await User.findById(userId);
        if(!user){
            throw new Error("User is not found");
        }
        req.user = user;
        next();
        
    }
    catch(e){
        res.status(400).send("ERROR: "+ e.message);
    }

}
module.exports = {
    userAuth
}

