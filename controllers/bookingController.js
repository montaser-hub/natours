const Stripe = require('stripe');
const Tour = require('../models/toursModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// Stripe is optional: without a secret key the app runs in "demo booking"
// mode so the full flow can be tried locally without a payment account.
const stripe = process.env.STRIPE_SECRET_KEY
  ? Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

exports.paymentsEnabled = () => Boolean(stripe);

/**
 * POST /api/v1/bookings/checkout/:tourId
 * - Stripe mode: returns a Checkout Session URL; the booking itself is only
 *   created by the signed webhook once payment succeeds.
 * - Demo mode: creates the booking immediately (price taken from the DB,
 *   never from the client).
 */
exports.checkout = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) return next(new AppError('No tour found with that ID', 404));

  if (!stripe) {
    const booking = await Booking.create({
      tour: tour.id,
      user: req.user.id,
      price: tour.price,
      paid: false
    });
    return res.status(201).json({
      status: 'success',
      mode: 'demo',
      data: { booking }
    });
  }

  const origin = `${req.protocol}://${req.get('host')}`;
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${origin}/my-tours?alert=booking`,
    cancel_url: `${origin}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: tour.id,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(tour.price * 100),
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`${origin}/img/tours/${tour.imageCover}`]
          }
        }
      }
    ]
  });

  res.status(200).json({ status: 'success', mode: 'stripe', url: session.url });
});

const createBookingFromSession = async session => {
  const user = await User.findOne({ email: session.customer_email });
  if (!user) return;

  // Idempotent: Stripe may deliver the same event more than once.
  await Booking.updateOne(
    { stripeSessionId: session.id },
    {
      $setOnInsert: {
        tour: session.client_reference_id,
        user: user.id,
        price: session.amount_total / 100,
        paid: true,
        stripeSessionId: session.id
      }
    },
    { upsert: true }
  );
};

/** POST /webhook-checkout — raw body, verified with the Stripe signature. */
exports.webhookCheckout = async (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(404).send('Payments are not configured');
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    await createBookingFromSession(event.data.object);
  }

  res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
