/* eslint-disable no-console */
// Usage: node dev-data/seed.js --import | --delete
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', 'config.env') });

const Tour = require('../models/toursModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const data = require('./data');

const DB = (process.env.DATABASE || '').replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD || ''
);

const deleteData = async () => {
  await Promise.all([
    Booking.deleteMany(),
    Review.deleteMany(),
    Tour.deleteMany(),
    User.deleteMany()
  ]);
  console.log('🗑  Deleted all tours, users, reviews and bookings');
};

const importData = async () => {
  await deleteData();

  // Users: create() so the pre-save hook hashes each password.
  const userIds = {};
  await Promise.all(
    data.users.map(async ({ key, ...u }) => {
      const user = await User.create({
        ...u,
        password: data.PASSWORD,
        passwordConfirm: data.PASSWORD
      });
      userIds[key] = user._id;
    })
  );

  // Tours: create() so the pre-save hook generates slugs.
  const tourIds = {};
  const toursByN = {};
  for (const t of data.tours) {
    const tour = await Tour.create({
      name: t.name,
      duration: t.duration,
      maxGroupSize: t.maxGroupSize,
      difficulty: t.difficulty,
      price: t.price,
      priceDiscount: t.priceDiscount,
      summary: t.summary,
      description: t.description,
      imageCover: `tour-${t.n}-cover.jpg`,
      images: [1, 2, 3].map(i => `tour-${t.n}-${i}.jpg`),
      startDates: t.startDates.map(d => new Date(d)),
      startLocation: { type: 'Point', ...t.startLocation },
      locations: t.locations.map(l => ({ type: 'Point', ...l })),
      guides: t.guides.map(k => userIds[k])
    });
    tourIds[t.n] = tour._id;
    toursByN[t.n] = tour;
  }

  // Bookings for every reviewer (reviews require a booking) plus extras.
  const bookingPairs = [
    ...data.reviews.map(([u, n]) => [u, n]),
    ...data.bookings
  ];
  await Booking.insertMany(
    bookingPairs.map(([u, n]) => ({
      user: userIds[u],
      tour: tourIds[n],
      price: toursByN[n].price,
      paid: true
    }))
  );

  // Reviews, then recompute each tour's rating stats from them.
  await Review.insertMany(
    data.reviews.map(([u, n, rating, review]) => ({
      user: userIds[u],
      tour: tourIds[n],
      rating,
      review
    }))
  );
  await Promise.all(
    Object.values(tourIds).map(id => Review.calcAverageRatings(id))
  );

  console.log(
    `✅ Imported ${data.users.length} users, ${data.tours.length} tours, ` +
      `${data.reviews.length} reviews, ${bookingPairs.length} bookings`
  );
  console.log(`\n   Demo login:  demo@natours.io / ${data.PASSWORD}`);
  console.log(`   Admin login: admin@natours.io / ${data.PASSWORD}\n`);
};

(async () => {
  const action = process.argv[2];
  if (!['--import', '--delete'].includes(action)) {
    console.log('Usage: node dev-data/seed.js --import | --delete');
    process.exit(1);
  }
  try {
    await mongoose.connect(DB);
    if (action === '--import') await importData();
    else await deleteData();
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
