const express = require('express');
const router = express.Router();
const service = require('../services/donation');
const {authenticate, authorize} = require('../middleware/auth');


router.get('/:id' , authenticate , authorize("admin") , service.getDonationByID);
router.delete('/:id' , authenticate , authorize("admin") , service.deleteDonation);
router.put('/:id' , authenticate , authorize("admin") , service.updateDonation);

router.get('/', authenticate ,  authorize("admin") , service.getDonations);
router.post('/' , authenticate , authorize("donor") , service.donate);

//Todo add tracking mechanism

module.exports = router;