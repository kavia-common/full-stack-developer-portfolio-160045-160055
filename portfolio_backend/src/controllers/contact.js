const portfolio = require('../services/portfolio');

// Simple email pattern for basic validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// PUBLIC_INTERFACE
/**
 * GET /api/contact
 * Returns public contact details (email/phone).
 */
function getContactDetails(req, res, next) {
  try {
    const data = portfolio.getContact();
    res.status(200).json({ status: 'ok', data });
  } catch (err) {
    next(err);
  }
}

// PUBLIC_INTERFACE
/**
 * POST /api/contact
 * Accepts contact form submissions and stores them in-memory (ephemeral).
 * Body: { name: string, email: string, message: string, subject?: string, phone?: string }
 */
function postContactMessage(req, res, next) {
  try {
    const { name, email, message, subject, phone } = req.body || {};
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Name is required (min 2 chars).' });
    }
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'A valid email is required.',
      });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({
        status: 'error',
        message: 'Message is required (min 10 chars).',
      });
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      subject: typeof subject === 'string' ? subject.trim() : undefined,
      phone: typeof phone === 'string' ? phone.trim() : undefined,
      ip: req.ip,
      userAgent: req.get('user-agent') || '',
    };

    const result = portfolio.submitContactMessage(payload);
    return res.status(201).json({
      status: 'ok',
      message: 'Your message has been received.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getContactDetails, postContactMessage };
