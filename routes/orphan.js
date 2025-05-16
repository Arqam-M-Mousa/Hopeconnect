const express = require('express');
const router = express.Router();
const service = require('../services/orphan');
const {authenticate, authorize} = require('../middleware/auth');


router.get('/sponsorships', service.getOrphansAvailableForSponsorship);

router.get('/:id', authenticate, service.getOrphanById);
router.delete('/:id', authenticate, authorize("admin"), service.deleteOrphan);
router.put('/:id', authenticate, authorize("admin"), service.updateOrphan);

router.get('/', service.getOrphans);
router.post('/', authenticate, authorize("admin"), service.createOrphan);

module.exports = router;