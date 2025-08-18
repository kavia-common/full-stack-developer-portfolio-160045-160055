const portfolio = require('../services/portfolio');
const emailService = require('../services/email');

// Simple email pattern for basic validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Sanitize and validate an email string.
 * - trims
 * - removes CR/LF to prevent header injection
 * - checks a simple email regex and length
 * Returns a clean string or null if invalid.
 */
function sanitizeEmail(input) {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (/[\r\n]/.test(trimmed)) return null; // prevent header injection
  if (trimmed.length < 3 || trimmed.length > 254) return null;
  if (!EMAIL_REGEX.test(trimmed)) return null;
  return trimmed;
}

/**
 * Sanitize generic text fields by:
 * - removing CR/LF
 * - trimming spaces
 * - bounding length
 */
function sanitizeText(input, maxLen = 1000) {
  if (typeof input !== 'string') return '';
  return input.replace(/[\r\n]/g, ' ').trim().slice(0, maxLen);
}

/**
 * Sanitize phone to a limited character set commonly used in phone numbers.
 */
function sanitizePhone(input) {
  if (typeof input !== 'string') return '';
  // allow digits, space, +, -, (, )
  return input.replace(/[^0-9+\-() ]/g, '').trim().slice(0, 50);
}

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
 * Accepts contact form submissions, stores them in-memory (ephemeral),
 * and sends an email notification to the portfolio owner using Nodemailer.
 * Body: { name: string, email: string, message: string, subject?: string, phone?: string }
 */
async function postContactMessage(req, res, next) {
  try {
    const { name, email, message, subject, phone } = req.body || {};

    const cleanName = sanitizeText(name, 100);
    if (!cleanName || cleanName.length < 2) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Name is required (min 2 chars).' });
    }

    const cleanEmail = sanitizeEmail(email);
    if (!cleanEmail) {
      return res.status(400).json({
        status: 'error',
        message: 'A valid email is required.',
      });
    }

    const cleanMessage = typeof message === 'string'
      ? message.replace(/\0/g, '').trim()
      : '';
    if (!cleanMessage || cleanMessage.length < 10) {
      return res.status(400).json({
        status: 'error',
        message: 'Message is required (min 10 chars).',
      });
    }

    const cleanSubject = subject ? sanitizeText(subject, 150) : undefined;
    const cleanPhone = phone ? sanitizePhone(phone) : undefined;

    const payload = {
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage.slice(0, 5000),
      subject: cleanSubject,
      phone: cleanPhone,
      ip: req.ip,
      userAgent: req.get('user-agent') || '',
    };

    // Store message (ephemeral)
    const result = portfolio.submitContactMessage(payload);

    // Send email (best-effort). If email fails, log error and return 201 to avoid leaking details.
    try {
      await emailService.sendContactEmail(payload, result);
    } catch (emailErr) {
      console.error(
        'Failed to send contact email:',
        emailErr && emailErr.message ? emailErr.message : emailErr
      );
    }

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
