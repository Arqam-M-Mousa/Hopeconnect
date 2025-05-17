const express = require('express');
const router = express.Router();
const service = require('../services/donation');
const {authenticate, authorize} = require('../middleware/auth');

router.get('/updates' , authenticate , authorize("admin") , service.getAllUpdates);

router.get('/:id' , authenticate , authorize("admin") , service.getDonationByID);
router.delete('/:id' , authenticate , authorize("admin") , service.deleteDonation);
router.put('/:id' , authenticate , authorize("admin") , service.updateDonation);
router.get('/:id/updates', authenticate , authorize("admin" , "donor") , service.getUserDonationsUpdates);

router.get('/:id/updates/:updateId' , authenticate , authorize("admin" , "donor") , service.getUserUpdateById);
router.get('/updates/:id' , authenticate , authorize("admin") , service.getUpdateById);

router.get('/', authenticate ,  authorize("admin") , service.getDonations);
router.post('/' , authenticate , authorize("donor") , service.donate);

module.exports = router;