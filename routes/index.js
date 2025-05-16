const express = require('express');
const router = express.Router();

const orphanageRoutes = require('./orphanage');
const orphanRoutes = require('./orphan');
const userRoutes = require('./user');
const SponsorshipRoute = require('./sponsorship');

router.use('/orphanages', orphanageRoutes);
router.use('/orphan', orphanRoutes);
router.use('/user', userRoutes);
router.use('/sponsorship', SponsorshipRoute);

module.exports = router;
