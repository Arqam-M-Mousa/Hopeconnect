const express = require('express');
const router = express.Router();

const orphanageRoutes = require('./orphanage');
const orphanRoutes = require('./orphan');
const userRoutes = require('./user');
const SponsorshipRoute = require('./sponsorship');
const danationRoutes = require('./danation');

router.use('/orphanages', orphanageRoutes);
router.use('/orphan', orphanRoutes);
router.use('/user', userRoutes);
router.use('/sponsorship', SponsorshipRoute);
router.use('/donation', danationRoutes);

module.exports = router;
