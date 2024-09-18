const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi'); // Joi for validation

const EsellerSchema = mongoose.Schema({
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

// Method to generate a JWT token for the Eseller
EsellerSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id }, // Payload: Eseller ID
        process.env.JWTPRIVATEKEY, // Secret key from environment variables
        { expiresIn: '1h' } // Token expiration time (1 hour)
    );

    return token;
};

// Static method for validating Eseller data
EsellerSchema.statics.validateEseller = function (esellerData) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        username :  Joi.string().min(2).max(50).required(),
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        password: Joi.string().min(6).required(),
        verified: Joi.boolean(),
        createdAt: Joi.date()
    });

    return schema.validate(esellerData);
};

EsellerSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const Eseller = mongoose.model("esellers", EsellerSchema);
module.exports = Eseller;
