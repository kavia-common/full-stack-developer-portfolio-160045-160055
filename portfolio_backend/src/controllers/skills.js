const portfolio = require('../services/portfolio');

// PUBLIC_INTERFACE
/**
 * GET /api/skills
 * Returns categorized skills and technologies.
 */
function getSkills(req, res, next) {
  try {
    const data = portfolio.getSkills();
    res.status(200).json({ status: 'ok', data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSkills };
