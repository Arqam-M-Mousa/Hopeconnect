const express = require('express');
const router = express.Router();
const service = require('../services/review');
const {authenticate, authorize} = require('../middleware/auth');


router.get('/reviews/:id', authenticate , service.getReviewById);

router.get('/' , authenticate, service.getReviews);
router.post('/' , authenticate , authorize("donor") , service.postReview);
router.put('/' , authenticate , authorize("donor") , service.updateReview);
router.delete('/' , authenticate ,authorize("donor" , "admin"), service.deleteReview);

module.exports = router;