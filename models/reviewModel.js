const mongoose = require('mongoose');
const Tour = require('./toursModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review field is required'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Rating field is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User field is required'],
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Tour field is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);
//allow only one review for user per tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});
//static method
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  //is the current tour id
  const stats = await this.aggregate([
    { $match: { tour: tourId } }, //match the tour that we wante to update
    {
      $group: {
        //statistics it self
        _id: '$tour', //grouped by tour
        nRating: { $sum: 1 }, //calculate number of tours that have been reviewed
        averageRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    // add if condition to avoid error where stats empty
    //update the tour document with the new stats
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].averageRating,
    });
  } else {
    // No reviews left: fall back to the schema default rather than 0 stars.
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};
//call function after review created this doc middleware just for create
reviewSchema.post('save', function () {
  //this points to the current review
  this.constructor.calcAverageRatings(this.tour);
});
//to do so and use statics method here to work with findByIdAndUpdate, findByIdAndDelete that aquery middleware do below sequance
//use query middleware to find document
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // clone(): Mongoose 6+ refuses to execute the same query object twice
  this.r = await this.clone().findOne(); // pass the doc from query middleware to post middleware
  next();
});

//then can use post middleware to excute the static method to update the tour statistics
reviewSchema.post(/^findOneAnd/, async function () {
  //this.r = await this.findOne(); does not work here, query already excuted
  if (this.r) await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
