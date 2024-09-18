const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true 
  },
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id },
    process.env.JWTPRIVATEKEY,
    { expiresIn: "1h" }
  );
  return token;
};

userSchema.statics.validateUser = function (userData) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    password: Joi.string().min(6).required(),
    verified: Joi.boolean(),
    createdAt: Joi.date(),
  });
  
  return schema.validate(userData);
};

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const User = mongoose.model("ebuyers", userSchema);

module.exports = User;
