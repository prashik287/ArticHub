const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    googleId: String,
    displayname: String,
    email: String,
    image: String,
    accountType: { type: String, default: 'seller' }, // Ensure accountType field
},{timestamps:true});



const sellerdb = new mongoose.model("seller",sellerSchema)
module.exports=sellerdb;