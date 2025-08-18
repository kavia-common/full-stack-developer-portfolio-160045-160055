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
 * (defaulting to sneha887@gmail.com). The "from" address is set to the visitor's email.
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
  const fromAddress = payload.email; // requirement: 'from' set to sender's email address
  const subject =
    payload.subject && payload.subject.trim().length > 0
      ? payload.subject.trim()
      : `New contact message from ${payload.name}`;

  const lines = [
    'You have received a new contact message via the portfolio website.',
    '',
    'Details:',
    `- Name: ${payload.name}`,
    `- Email: ${payload.email}`,
    payload.phone ? `- Phone: ${payload.phone}` : null,
    meta.id ? `- Message ID: ${meta.id}` : null,
    meta.createdAt ? `- Created At: ${meta.createdAt}` : null,
    payload.ip ? `- IP: ${payload.ip}` : null,
    payload.userAgent ? `- User-Agent: ${payload.userAgent}` : null,
    '',
    'Message:',
    payload.message,
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <div style='font-family:Arial, Helvetica, sans-serif; line-height:1.5; color:#111;'>
      <p>You have received a new contact message via the portfolio website.</p>
      <h3 style='margin-bottom:6px;'>Details</h3>
      <ul>
        <li><strong>Name:</strong> ${payload.name}</li>
        <li><strong>Email:</strong> ${payload.email}</li>
        ${payload.phone ? `<li><strong>Phone:</strong> ${payload.phone}</li>` : ''}
        ${meta.id ? `<li><strong>Message ID:</strong> ${meta.id}</li>` : ''}
        ${meta.createdAt ? `<li><strong>Created At:</strong> ${meta.createdAt}</li>` : ''}
        ${payload.ip ? `<li><strong>IP:</strong> ${payload.ip}</li>` : ''}
        ${payload.userAgent ? `<li><strong>User-Agent:</strong> ${payload.userAgent}</li>` : ''}
      </ul>
      <h3 style='margin-bottom:6px;'>Message</h3>
      <pre style='white-space:pre-wrap; font-family:inherit; background:#f6f8fa; padding:12px; border-radius:6px; border:1px solid #eaecef;'>${payload.message}</pre>
    </div>
  `;

  const mailOptions = {
    to,
    from: `${payload.name} <${fromAddress}>`,
    replyTo: payload.email,
    subject,
    text: lines,
    html,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendContactEmail,
};
