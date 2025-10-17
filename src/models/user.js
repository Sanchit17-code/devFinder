const mongoose = require("mongoose");
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName:{
        type: String
    },
    emailId:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address: " + value );
            }
        }
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong psssword " + value );
            }
        }
    },
    age:{
        type: Number,
        min: 18,
    },
    gender:{
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl :{
        type: String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL: " + value );
            }
        }
    },
    about:{
        type: String,
        default : "this is a default about of this user"
    },
    skills: {
        type: [String],
    }
},
{
    timestamps: true,
}
)
// dont use arrow functions here okay as the definition of this will change then 
userSchema.methods.getJWT = function(){
    const user = this; // as this will be called by the instance of the user only
    const token =   jwt.sign({_id : user._id},"somePrivateKey#1244", {
                        expiresIn : "1d",
                    });
        return token;
}
userSchema.methods.validatePassword = async function(userEnteredPassword){
    const user = this;
    const passwordHash = user.password;
    const isPasswordMatching = await bcrypt.compare(userEnteredPassword,passwordHash);
    return isPasswordMatching;
}
const User = mongoose.model("User",userSchema);
module.exports = User;