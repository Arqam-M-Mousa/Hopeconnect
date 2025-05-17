const express = require('express');
const router = express.Router();
const service = require('../services/volunteer');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/me', authenticate, service.getCurrentVolunteerProfile);
router.put('/me', authenticate, service.updateCurrentVolunteerProfile);
router.delete('/me', authenticate, service.deleteCurrentVolunteerProfile);

router.get('/search', authenticate, authorize('admin'), service.searchVolunteers);
router.get('/:id', authenticate, authorize('admin'), service.getVolunteerById);
router.delete('/:id', authenticate, authorize('admin'), service.deleteVolunteerById);
router.put('/:id', authenticate, authorize('admin'), service.updateVolunteerById);
router.put('/:id/verify', authenticate, authorize('admin'), service.verifyVolunteer);
router.post('/:id/apply', authenticate, service.applyToHelpRequest);
router.get('/:id/applications', authenticate, service.getVolunteerApplications);
router.delete('/:id/applications/:applicationId', authenticate, service.cancelApplication);
router.get('/:id/matches', authenticate, service.matchVolunteerToOpportunities);


router.get('/', authenticate, authorize('admin'), service.getVolunteers);



module.exports = router;
