const express = require('express');
const router = express.Router();
const service = require('../services/sponsorship');
const {authenticate, authorize} = require('../middleware/auth');


router.post('/create', authenticate, authorize("donor"), service.createSponsorship);

router.get('/:id', authenticate, service.getSponsorshipById);
router.put('/:id/update', authenticate, service.updateSponsorship);

router.get('/', authenticate, authorize("admin"), service.getSponsorships);

module.exports = router;