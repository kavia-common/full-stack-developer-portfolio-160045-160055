const portfolio = require('../services/portfolio');

// PUBLIC_INTERFACE
/**
 * GET /api/projects
 * Returns the featured project highlights.
 */
function getProjects(req, res, next) {
  try {
    const data = portfolio.getProjects();
    res.status(200).json({ status: 'ok', data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProjects };
