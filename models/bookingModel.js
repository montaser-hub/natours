const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a tour']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user']
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price']
  },
  createdAt: {
    type: Date,
    default: Date.now // function reference: evaluated per booking, not once at startup
  },
  paid: {
    type: Boolean,
    default: true
  },
  // Set for Stripe bookings; makes webhook processing idempotent.
  stripeSessionId: {
    type: String,
    unique: true,
    sparse: true
  }
});
// populate the user and tour auto whenever there is a query using query middleware
bookingSchema.index({ user: 1, tour: 1 });

bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name'
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
