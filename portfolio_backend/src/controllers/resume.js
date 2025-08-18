const portfolio = require('../services/portfolio');
const path = require('path');

// PUBLIC_INTERFACE
/**
 * GET /api/resume
 * Sends the resume file for download.
 */
function downloadResume(req, res, next) {
  try {
    const resumePath = portfolio.getResumePath();
    const filename = path.basename(resumePath);
    res.download(resumePath, filename, (err) => {
      if (err) next(err);
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { downloadResume };
