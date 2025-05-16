const express = require('express');
const router = express.Router();
const service = require('../services/orphan');
const {authenticate, authorize} = require('../middleware/auth');


router.get('/sponsorship' , service.getOrphansForSponsorship);
router.post('/create' , authenticate ,  authorize("admin") , service.createOrphan);

router.get('/:id', authenticate, service.getOrphanById);
router.delete('/:id' , authenticate,authorize("admin"), service.deleteOrphan);

router.put('/:id/updates' , authenticate , authorize("admin"), service.updateOrphan);

router.get('/', service.getOrphans);

module.exports = router;