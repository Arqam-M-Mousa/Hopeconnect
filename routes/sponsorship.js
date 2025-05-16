const express = require('express');
const router = express.Router();
const service = require('../services/sponsorship');
const {authenticate, authorize} = require('../middleware/auth');



router.get('/:id', authenticate, service.getSponsorshipById);
router.put('/:id', authenticate, service.updateSponsorship);
router.delete('/:id',authenticate, authorize("donor", "admin"), service.deleteSponsorship);

router.get('/', authenticate, authorize("admin"), service.getSponsorships);
router.post('/', authenticate, authorize("donor"), service.createSponsorship);

module.exports = router;