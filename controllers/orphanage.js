const express = require('express');
const router = express.Router();
const service = require('../services/orphanage');
const authenticate = require('../middleware/auth');

// Orphanage routes
router.get("/", service.getAllOrphanages);
router.get("/statistics", authenticate, service.getStatistics);
router.get("/:id", service.getOrphanageById);
router.post("/create", authenticate, service.createOrphanage);
router.put("/:id", authenticate, service.updateOrphanage);
router.delete("/:id", authenticate, service.deleteOrphanage);

// Help request routes
router.get("/help-requests", service.getHelpRequests);
router.get("/:id/help-requests", service.getOrphanageHelpRequests);
router.get("/:id/help-requests/:requestId", service.getHelpRequestById);
router.post("/:id/help-requests", authenticate, service.createHelpRequest);
router.put("/:id/help-requests/:requestId", authenticate, service.updateHelpRequest);
router.delete("/:id/help-requests/:requestId", authenticate, service.deleteHelpRequest);

module.exports = router;