const validator = require("validator");

const signupValidator = (req)=>{
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName){
        throw new Error("first name is required");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Enter valid email address");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error ("Please enter  strong password");
    }
    
}

module.exports = {
    signupValidator
}