const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    mobileNo:{type:String,required:true},
    gender:{type:String,required:true,enum:["male","female","other"]},
    age:{type:Number,required:true}
})

const userModel = mongoose.model("user",userSchema)

module.exports = userModel