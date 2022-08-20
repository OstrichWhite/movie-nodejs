const mongoose = require('mongoose');
const Movie = require('../models/movieModel')
const User = require('../models/userModel')
const Like = require('../models/likeModel')

exports.toggleLike = async (req,res)=>{
  let movieId = req.params.id;
  if(!mongoose.Types.ObjectId.isValid(movieId)){
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid Movie Id',
    })
  }

  Movie.findOne({_id:movieId})
  .then(async movie => {
    if(!movie){
      return res.status(400).json({
        status: 'fail',
        message: 'There is no such movie',
      })
    }
      
    let currentUser=req.user;

    Like.findOne({ movie_id: movieId, user_id: currentUser._id })
    .then(async like => {
      try {
        if(!like){
          let likeDoc = new Like({ movie_id: movieId, user_id: currentUser._id })
          let likeData = await likeDoc.save()
          await User.updateOne({ _id:currentUser._id },{ $push: { likes: likeData._id }})
          await Movie.updateOne({ _id:movieId },{ $inc: { votes: 1 }})

          return res.status(200).json({
            status: 'success',
            message: 'Movie liked successfully'
          })
        }
        else{
          await Like.deleteOne({ _id: like._id })
          await User.updateOne({ _id:currentUser._id },{ $pull: { likes: like._id }})
          await Movie.updateOne({ _id:movieId },{ $inc: { votes: -1 }})

          return res.status(200).json({
            status: 'success',
            message: 'Movie disliked successfully'
          })
        }
      }

      catch(err){
        return res.status(500).json({ status: 'error', message: err.message, data: err })
      } 

    })

    .catch((err)=>{
      return res.status(500).json({ status: 'error', message: err.message, data: err })
    })
    
  })
  
  .catch((err)=>{
    return res.status(500).json({ status: 'error', message: err.message, data: err })
  })
  
};