const express = require('express');
const router = express.Router();

const orphanageRoutes = require('./orphanage');
const orphanRoutes = require('./orphan');
const userRoutes = require('./user');
const SponsorshipRoute = require('./sponsorship');
const donationRoutes = require('./donation');
const volunteerRoutes = require('./volunteer');


router.use('/orphanage', orphanageRoutes);
router.use('/orphan', orphanRoutes);
router.use('/user', userRoutes);
router.use('/sponsorship', SponsorshipRoute);
router.use('/donation', donationRoutes);
router.use('/volunteer', volunteerRoutes);


module.exports = router;
