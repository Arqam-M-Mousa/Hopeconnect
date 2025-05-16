const express = require('express');
const router = express.Router();
const service = require('../services/orphanage');
const {authenticate, authorize} = require('../middleware/auth');

// Static/specific routes first
router.get("/statistics", service.getStatistics);
router.get("/help-requests", service.getHelpRequests);

// Parametric routes for orphanages
router.get("/:id", service.getOrphanageById);
router.put("/:id", authenticate, authorize("admin"), service.updateOrphanage);
router.delete("/:id", authenticate, authorize("admin"), service.deleteOrphanage);

// Nested parametric routes for help requests
router.get("/:id/help-requests", service.getOrphanageHelpRequests);
router.post("/:id/help-requests", authenticate, authorize("admin"), service.createHelpRequest);
router.get("/:id/help-requests/:requestId", service.getHelpRequestById);
router.put("/:id/help-requests/:requestId", authenticate, authorize("admin"), service.updateHelpRequest);
router.delete("/:id/help-requests/:requestId", authenticate, authorize("admin"), service.deleteHelpRequest);

// Most generic route last
router.get("/", service.getOrphanages);
router.post("/", authenticate, authorize("admin"), service.createOrphanage);

module.exports = router;