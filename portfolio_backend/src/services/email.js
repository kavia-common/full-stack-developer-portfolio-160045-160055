'use strict';

const nodemailer = require('nodemailer');

/**
 * Parse a boolean-like environment variable safely.
 * Accepts: "true", "1", "yes" (case-insensitive) as true; otherwise false.
 */
function parseBool(val) {
  if (typeof val === 'boolean') return val;
  if (typeof val !== 'string') return false;
  return ['true', '1', 'yes'].includes(val.toLowerCase());
}

/**
 * Basic email validator/sanitizer:
 * - trims
 * - removes CR/LF to prevent header injection
 * - checks a simple email regex
 * - enforces reasonable length
 * Returns a clean string or null if invalid.
 */
function sanitizeEmail(input) {
  if (typeof input !== 'string') return null;
  let value = input.trim();
  // Disallow header injection via CRLF
  if (/[\r\n]/.test(value)) return null;
  // Very basic sanity check
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value.length < 3 || value.length > 254) return null;
  if (!EMAIL_REGEX.test(value)) return null;
  return value;
}

/**
 * Create a Nodemailer transporter from environment variables.
 * Required envs:
 *   - SMTP_HOST
 *   - SMTP_PORT
 *   - SMTP_SECURE (boolean-like string)
 *   - SMTP_USER
 *   - SMTP_PASS
 */
function createTransporter() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT) {
    throw new Error('SMTP configuration is incomplete: SMTP_HOST/SMTP_PORT are required.');
  }

  const secure = parseBool(SMTP_SECURE);
  const portNum = Number(SMTP_PORT);

  const transportConfig = {
    host: SMTP_HOST,
    port: Number.isNaN(portNum) ? 587 : portNum,
    secure, // true for 465, false for other ports
  };

  // Add auth only if provided (some servers may allow IP-based relay)
  if (SMTP_USER && SMTP_PASS) {
    transportConfig.auth = {
      user: SMTP_USER,
      pass: SMTP_PASS,
    };
  }

  return nodemailer.createTransport(transportConfig);
}

// PUBLIC_INTERFACE
/**
 * Send an email with contact message details.
 * This uses SMTP settings from environment variables and sends to CONTACT_RECIPIENT_EMAIL
 * (defaulting to sneha887@gmail.com). The "from" header is set to the visitor's email
 * (strictly the email address, no display name) to satisfy the requirement that
 * the sender be the user's input. To improve deliverability and avoid SPF/DMARC issues,
 * the SMTP "envelope" sender can be overridden with MAIL_ENVELOPE_FROM or falls back to SMTP_USER.
 *
 * @param {object} payload - Contact form payload
 * @param {string} payload.name - Sender name
 * @param {string} payload.email - Sender email (used in "from" and "replyTo")
 * @param {string} payload.message - Message body
 * @param {string} [payload.subject] - Optional subject
 * @param {string} [payload.phone] - Optional phone number
 * @param {string} [payload.ip] - Sender IP (captured from request)
 * @param {string} [payload.userAgent] - User-Agent string (captured from request)
 * @param {object} [meta] - Optional metadata (e.g., { id, createdAt })
 * @returns {Promise<object>} Resolves to nodemailer send result
 */
async function sendContactEmail(payload, meta = {}) {
  const transporter = createTransporter();

  const to = process.env.CONTACT_RECIPIENT_EMAIL || 'sneha887@gmail.com';

  // Ensure 'from' is always the user's email (no display name)
  const fromAddress = sanitizeEmail(payload.email);
  if (!fromAddress) {
    throw new Error('Invalid sender email provided.');
  }

  // Optional SMTP envelope sender for deliverability
  // Use MAIL_ENVELOPE_FROM when set; otherwise try SMTP_USER; finally fallback to fromAddress
  const envelopeFrom =
    sanitizeEmail(process.env.MAIL_ENVELOPE_FROM || '') ||
    sanitizeEmail(process.env.SMTP_USER || '') ||
    fromAddress;

  const safeName = typeof payload.name === 'string'
    ? payload.name.replace(/[\r\n<>]/g, '').trim().slice(0, 100)
    : 'Portfolio Contact';

  const subject =
    typeof payload.subject === 'string' && payload.subject.trim().length > 0
      ? payload.subject.replace(/[\r\n]/g, ' ').trim().slice(0, 150)
      : `New contact message from ${safeName}`;

  const safePhone = typeof payload.phone === 'string'
    ? payload.phone.replace(/[\r\n]/g, '').trim().slice(0, 50)
    : '';

  const safeMessage = typeof payload.message === 'string'
    ? payload.message.replace(/\0/g, '').slice(0, 5000)
    : '';

  const lines = [
    'You have received a new contact message via the portfolio website.',
    '',
    'Details:',
    `- Name: ${safeName}`,
    `- Email: ${fromAddress}`,
    safePhone ? `- Phone: ${safePhone}` : null,
    meta.id ? `- Message ID: ${meta.id}` : null,
    meta.createdAt ? `- Created At: ${meta.createdAt}` : null,
    payload.ip ? `- IP: ${payload.ip}` : null,
    payload.userAgent ? `- User-Agent: ${payload.userAgent}` : null,
    '',
    'Message:',
    safeMessage,
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <div style='font-family:Arial, Helvetica, sans-serif; line-height:1.5; color:#111;'>
      <p>You have received a new contact message via the portfolio website.</p>
      <h3 style='margin-bottom:6px;'>Details</h3>
      <ul>
        <li><strong>Name:</strong> ${safeName}</li>
        <li><strong>Email:</strong> ${fromAddress}</li>
        ${safePhone ? `<li><strong>Phone:</strong> ${safePhone}</li>` : ''}
        ${meta.id ? `<li><strong>Message ID:</strong> ${meta.id}</li>` : ''}
        ${meta.createdAt ? `<li><strong>Created At:</strong> ${meta.createdAt}</li>` : ''}
        ${payload.ip ? `<li><strong>IP:</strong> ${payload.ip}</li>` : ''}
        ${payload.userAgent ? `<li><strong>User-Agent:</strong> ${payload.userAgent}</li>` : ''}
      </ul>
      <h3 style='margin-bottom:6px;'>Message</h3>
      <pre style='white-space:pre-wrap; font-family:inherit; background:#f6f8fa; padding:12px; border-radius:6px; border:1px solid #eaecef;'>${safeMessage}</pre>
    </div>
  `;

  const mailOptions = {
    to,
    // Requirement: 'from' must be the user-supplied email (no display name to reduce rejections)
    from: fromAddress,
    replyTo: fromAddress,
    subject,
    text: lines,
    html,
    headers: {
      'X-Contact-Message-ID': meta.id || '',
    },
    // Envelope sender can be set to an authenticated domain to avoid SPF/DMARC rejections
    envelope: {
      from: envelopeFrom,
      to,
    },
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendContactEmail,
};
