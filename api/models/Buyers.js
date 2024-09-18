const mongose = require("mongoose")
const  bcrypt = require("bcryptjs")
// const UserSchema = new mongose.Schema({
//     name : {type : String ,required:true},
//     email : {type : String , required : true},
//     password : {type:String,required : true},
//     isAdmin : {type:Boolean,default:false}

// },{timestamps : true})

// module.exports = mongose.model("User",UserSchema)
// const userSchema = new mongose.Schema({
//     googleId : String,
//     displayname : String,
//     email:String,
//     image : String,
//     accountType: {
//         type: String,
//         enum: ['buyer', 'seller'],
//         default: 'buyer'
//     }
// },{timestamps:true})
const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema({
    googleId: String,
    displayname: String,
    email: String,
    image: String,
    accountType: { type: String, default: 'buyer' }, // Ensure accountType field
},{timestamps:true});



const buyerdb = new mongose.model("buyers",buyerSchema)
module.exports=buyerdb;