const express = require('express');
const router = express.Router();
const service = require('../services/user');
const {authenticate, authorize} = require('../middleware/auth');


router.post('/register', service.register);
router.post('/login', service.login);

router.get('/me', authenticate, service.getCurrentUserProfile);
router.put('/me', authenticate, service.updateCurrentUserProfile);
router.delete('me', authenticate, service.deleteCurrentUserProfile);

router.delete('/:id', authenticate, authorize("admin"), service.deleteUserById);
router.get('/:id', authenticate, authorize("admin"), service.getUserById);
router.get('/', authenticate, authorize("admin"), service.getUsers);

module.exports = router;