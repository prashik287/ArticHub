const router = require("express").Router()
const Users = require("./models/Buyers");
const User  = require('./models/Buyers')
router.post("/users",async (req,res)=>{
     await  User.deleteMany({});
     const UserSeeder = await User.insertMany(User);
     res.send({UserSeeder})
})
module.exports = router;