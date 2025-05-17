    const express = require('express');
    const router = express.Router();
    const service = require('../services/volunteer');
    const { authenticate, authorize } = require('../middleware/auth');

    router.post('/volunteers/register', service.register);
    router.post('/volunteers/login', service.login);

    router.get('/me', authenticate, service.getCurrentVolunteerProfile);
    router.put('/me', authenticate, service.updateCurrentVolunteerProfile);
    router.delete('/me', authenticate, service.deleteCurrentVolunteerProfile);

    router.get('/me/services', authenticate, service.getServices);
    router.post('/me/services', authenticate, service.addService);
    router.put('/me/services/:serviceId', authenticate, service.updateService);
    router.delete('/me/services/:serviceId', authenticate, service.deleteService);

    router.get('/search', authenticate, authorize('admin'), service.searchVolunteers);
    router.get('/available', authenticate, authorize('admin'), service.getAvailableVolunteers);
    router.get('/:id', authenticate, authorize('admin'), service.getVolunteerById);
    router.delete('/:id', authenticate, authorize('admin'), service.deleteVolunteerById);
    router.put('/:id/verify', authenticate, authorize('admin'), service.verifyVolunteer);
    router.get('/', authenticate, authorize('admin'), service.getVolunteers);

    module.exports = router;
