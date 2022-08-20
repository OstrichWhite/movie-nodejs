const mongoose = require('mongoose');
const Movie = require('./movieModel');

const likeSchema = new mongoose.Schema(
  {
    movie_id: {type: mongoose.Schema.Types.ObjectId, ref:'Movie'},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  },
  {
    timestamps: true, 
  }
);

// likeSchema.statics.updateVotes= async function (movieId) {
//   await Movie.findByIdAndUpdate(movieId, {$inc: {votes: 1}})
// }

// likeSchema.post('save', function () {
//   // this points to current like
//   this.constructor.updateVotes(this.movie_id);
// });

const Like = mongoose.model('Like',likeSchema);
module.exports = Like;