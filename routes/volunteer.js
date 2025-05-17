const express = require('express');
const router = express.Router();
const service = require('../services/volunteer');
const {authenticate, authorize} = require('../middleware/auth');

router.get('/me', authenticate, authorize('volunteer'), service.getCurrentVolunteerProfile);
router.put('/me', authenticate, authorize('volunteer'), service.updateCurrentVolunteerProfile);
router.delete('/me', authenticate, authorize('volunteer'), service.deleteCurrentVolunteerProfile);
router.get('/me/applications', authenticate, service.getVolunteerApplications);

router.get('/search', authenticate, authorize('admin'), service.searchVolunteers);
router.get('/:id', authenticate, authorize('admin'), service.getVolunteerById);
router.delete('/:id', authenticate, authorize('admin'), service.deleteVolunteerById);
router.put('/:id', authenticate, authorize('admin'), service.updateVolunteerById);
router.put('/:id/verify', authenticate, authorize('admin'), service.verifyVolunteer);
router.post('/:id/apply', authenticate, authorize('volunteer'), service.applyToHelpRequest);
router.delete('/:id/applications/:applicationId', authenticate, service.cancelApplication);
router.get('/:id/matches', authenticate, service.matchVolunteerToOpportunities);


router.get('/', authenticate, authorize('admin'), service.getVolunteers);


module.exports = router;
