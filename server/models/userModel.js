const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please prove a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please Confirm your password'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Password must be same',
      },
    },
    likes: [{type: mongoose.Schema.Types.ObjectId, ref:'Like'}],
  },
  {
    timestamps: true, 
  }
);

// mongoose middlewares
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; //dont need to store in DB just for verification
  next();
});

// mongoose methods
userSchema.methods.correctPassword = async function (inputPassword, userPassword) {
  return await bcrypt.compare(inputPassword, userPassword);
};


const User = mongoose.model('User',userSchema);
module.exports = User;