const portfolio = require('../services/portfolio');

// PUBLIC_INTERFACE
/**
 * GET /api/experience
 * Returns timeline of professional experience entries.
 */
function getExperience(req, res, next) {
  try {
    const data = portfolio.getExperience();
    res.status(200).json({ status: 'ok', data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getExperience };
