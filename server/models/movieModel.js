const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Movie must have name']
    },
    votes:{
      type: Number,
      default: 0
    },
    // delstatus:{
    //   type: Number,
    //   default: 0
    // },
  },
  {
    timestamps: true, 
  }
);

const Movie = mongoose.model('Movie',movieSchema);
module.exports = Movie;