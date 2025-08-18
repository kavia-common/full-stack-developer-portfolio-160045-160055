const healthService = require('../services/health');

/**
 * Simple controller for health status.
 */
class HealthController {
  // PUBLIC_INTERFACE
  /**
   * GET /
   * Health check endpoint that returns service status.
   */
  check(req, res) {
    const healthStatus = healthService.getStatus();
    return res.status(200).json(healthStatus);
  }
}

module.exports = new HealthController();
