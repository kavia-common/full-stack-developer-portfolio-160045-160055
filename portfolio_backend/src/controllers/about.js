const portfolio = require('../services/portfolio');

// PUBLIC_INTERFACE
/**
 * GET /api/about
 * Returns introduction and objective for the About section.
 */
function getAbout(req, res, next) {
  try {
    const data = portfolio.getAbout();
    res.status(200).json({ status: 'ok', data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAbout };
