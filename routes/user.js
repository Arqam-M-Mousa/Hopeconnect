const express = require('express');
const router = express.Router();
const service = require('../services/user');
const {authenticate, authorize} = require('../middleware/auth');


router.post('/register', service.register);
router.post('/login', service.login);
router.get('/profile', authenticate, service.getUserProfile);
router.put('/profile', authenticate, service.updateUserProfile);
router.delete('/delete' , authenticate , authorize("admin"), service.deleteUser);

router.get('/:id' , authenticate , service.getUserById);

router.get('/' , authenticate , service.getUsers);

module.exports = router;