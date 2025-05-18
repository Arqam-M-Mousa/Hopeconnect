const express = require('express');
const router = express.Router();
const service = require('../services/deliveryTracking');
const {authenticate, authorize} = require('../middleware/auth');

router.get('/:id', authenticate, authorize('admin', 'donor'), service.getById);
router.put('/:id', authenticate, authorize('admin'), service.updateDelivery);
router.delete('/:id', authenticate, authorize('admin'), service.deleteDelivery);

router.get('/:id/location', authenticate, authorize('admin', 'donor'), service.getCurrentLocation);

router.get('/', authenticate, authorize('admin'), service.getAllDeliveries);
router.post('/', authenticate, authorize('admin'), service.createDelivery);


module.exports = router;

