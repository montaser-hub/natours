const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
const requireLogin = [authController.isLoggedIn, authController.requireLogin];

router.get('/me', requireLogin, viewsController.getAccount);
router.get('/my-tours', requireLogin, viewsController.getMyTours);
router.get('/my-reviews', requireLogin, viewsController.getMyReviews);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
