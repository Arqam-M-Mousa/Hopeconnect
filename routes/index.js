const express = require('express');
const router = express.Router();

const orphanageRoutes = require('./orphanage');

router.use('/orphanages', orphanageRoutes);

module.exports = router;
