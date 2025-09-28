const mongoose = require("mongoose")

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://sanchitagrawal429_db_user:gkPNxvgJ7zNOR1sp@learningnode.lql8vcw.mongodb.net/devFinder");
}

module.exports = connectDB;