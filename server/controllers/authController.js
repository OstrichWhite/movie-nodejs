const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined; //remove password from the output
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = async (req, res, next) => {
  try{
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    createSendToken(newUser, 201, res);
  }
  catch(err){
    return res.status(500).json({ status: 'error', message: err.message, data: err })
  }   
};

exports.login = async (req, res, next) => {
  try{
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password!',
      })
    }
  
    const user = await User.findOne({ email }).select('+password');
  
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect Email or Password',
      })
    }
    createSendToken(user, 200, res);
  }
  catch(err){
    return res.status(500).json({ status: 'error', message: err.message, data: err })
  }
};

exports.protect = async (req, res, next) => {
  try{

    // getting token and check of its there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
  
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in, Please log in to get Access',
      })
    }
  
    // verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
    // check if the user still exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser)  return res.status(401).json({
      status: 'fail',
      message: 'The user belonging to this token does not exist.',
    })
  
    //Grant Access to protected route
    req.user = currentUser; //current user get by jwt payload id
    next();
  }
  catch(err){
    return res.status(500).json({ status: 'error', message: err.message, data: err })
  }
};