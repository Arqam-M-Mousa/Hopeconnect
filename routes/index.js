const express = require('express');
const router = express.Router();

const orphanageRoutes = require('./orphanage');
const orphanRoutes = require('./orphan');
const userRoutes = require('./user');

router.use('/orphanages', orphanageRoutes);
router.user('/orphan' , orphanRoutes);
router.use('/user' , userRoutes);

module.exports = router;
