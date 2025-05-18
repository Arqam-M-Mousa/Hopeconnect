const express = require('express');
const router = express.Router();
const service = require('../services/partner');
const { authenticate, authorize } = require('../middleware/auth');


router.post('/', authenticate, authorize('admin'), service.createPartner);
router.get('/:id', service.getPartnerById);
router.put('/:id', authenticate, authorize('admin'), service.updatePartner);
router.delete('/:id', authenticate, authorize('admin'), service.deletePartner);

router.get('/:partnerId/orphanages', service.getOrphanagesForPartner);
router.post('/:partnerId/orphanages/:orphanageId', authenticate, authorize('admin'), service.linkPartnerToOrphanage);
router.delete('/:partnerId/orphanages/:orphanageId', authenticate, authorize('admin'), service.unlinkPartnerFromOrphanage);

router.get('/', service.getAllPartners);

module.exports = router;
