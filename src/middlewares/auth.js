const isAdminAuth = (req,res,next)=>{
    const isAuthenticated = true;
    if(!isAuthenticated){
        res.status(401).send("Unauthorized request");
    }
    else{
        next();
    }
}
const isUserAuth = (req,res,next)=>{
    const isAuthenticated = true;
    if(!isAuthenticated){
        res.status(401).send("Unauthorized request");
    }
    else{
        next();
    }
}

module.exports = {
    isAdminAuth,
    isUserAuth
}

