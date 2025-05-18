const express = require('express');
const router = express.Router();
const partnerService = require('../services/partner');
const { authenticate, authorize } = require('../middleware/auth');


router.post('/', authenticate, authorize('admin'), partnerService.createPartner);
router.get('/:id', partnerService.getPartnerById);
router.put('/:id', authenticate, authorize('admin'), partnerService.updatePartner);
router.delete('/:id', authenticate, authorize('admin'), partnerService.deletePartner);

router.get('/:partnerId/orphanages', partnerService.getOrphanagesForPartner);
router.post('/:partnerId/orphanages/:orphanageId', authenticate, authorize('admin'), partnerService.linkPartnerToOrphanage);
router.delete('/:partnerId/orphanages/:orphanageId', authenticate, authorize('admin'), partnerService.unlinkPartnerFromOrphanage);

router.get('/', partnerService.getAllPartners);

module.exports = router;
