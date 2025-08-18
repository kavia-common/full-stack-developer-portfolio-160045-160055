const express = require('express');
const aboutController = require('../controllers/about');
const skillsController = require('../controllers/skills');
const experienceController = require('../controllers/experience');
const projectsController = require('../controllers/projects');
const contactController = require('../controllers/contact');
const resumeController = require('../controllers/resume');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: About
 *     description: Introduction and objective
 *   - name: Skills
 *     description: Skills and technologies
 *   - name: Experience
 *     description: Professional experience timeline
 *   - name: Projects
 *     description: Featured projects
 *   - name: Contact
 *     description: Contact details and form submission
 *   - name: Resume
 *     description: Downloadable resume
 */

/**
 * @swagger
 * /api/about:
 *   get:
 *     summary: Get About content
 *     description: Returns the introduction and objective of the portfolio owner.
 *     tags: [About]
 *     responses:
 *       200:
 *         description: About information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   $ref: '#/components/schemas/About'
 */
router.get('/about', aboutController.getAbout);

/**
 * @swagger
 * /api/skills:
 *   get:
 *     summary: Get skills and technologies
 *     description: Returns categorized list of skills.
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: Skills list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SkillCategory'
 */
router.get('/skills', skillsController.getSkills);

/**
 * @swagger
 * /api/experience:
 *   get:
 *     summary: Get experience timeline
 *     description: Returns the professional experience timeline with projects and achievements.
 *     tags: [Experience]
 *     responses:
 *       200:
 *         description: Experience timeline
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ExperienceItem'
 */
router.get('/experience', experienceController.getExperience);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get featured projects
 *     description: Returns the portfolio project highlights.
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Projects list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 */
router.get('/projects', projectsController.getProjects);

/**
 * @swagger
 * /api/contact:
 *   get:
 *     summary: Get public contact details
 *     description: Returns email and phone for contact.
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: Contact details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   $ref: '#/components/schemas/ContactDetails'
 *   post:
 *     summary: Submit a contact message
 *     description: Accepts a contact message from the website visitor.
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactMessageRequest'
 *     responses:
 *       201:
 *         description: Message accepted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactMessageResponse'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/contact', contactController.getContactDetails);
router.post('/contact', contactController.postContactMessage);

/**
 * @swagger
 * /api/resume:
 *   get:
 *     summary: Download resume
 *     description: Returns the resume file as an attachment.
 *     tags: [Resume]
 *     responses:
 *       200:
 *         description: Resume file
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/resume', resumeController.downloadResume);

module.exports = router;
