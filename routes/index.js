const express = require('express');
const router = express.Router();

const orphanageRoutes = require('./orphanage');
const orphanRoutes = require('./orphan');
const userRoutes = require('./user');
const SponsorshipRoute = require('./sponsorship');
const donationRoutes = require('./donation');
const volunteerRoutes = require('./volunteer');
const reviewRoutes = require('./review');
const deliveryRoutes = require('./deliveryTracking');
const partnerRoutes = require('./partnership');

router.use('/orphanage', orphanageRoutes);
router.use('/orphan', orphanRoutes);
router.use('/user', userRoutes);
router.use('/sponsorship', SponsorshipRoute);
router.use('/donation', donationRoutes);
router.use('/volunteer', volunteerRoutes);
router.use('/review', reviewRoutes);
router.use('/deliveryTracking', deliveryRoutes);
router.use('/partner', partnerRoutes);


module.exports = router;
