const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Portfolio Backend API',
      version: '1.0.0',
      description:
        'RESTful APIs serving a professional portfolio website: About, Skills, Experience, Projects, Contact, and Resume download.',
      contact: {
        name: 'Portfolio Backend',
      },
    },
    tags: [
      { name: 'Health', description: 'Health and diagnostics' },
      { name: 'About', description: 'Introduction and objective' },
      { name: 'Skills', description: 'Skills and technologies' },
      { name: 'Experience', description: 'Professional experience timeline' },
      { name: 'Projects', description: 'Featured projects' },
      { name: 'Contact', description: 'Contact details and form submission' },
      { name: 'Resume', description: 'Downloadable resume' },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Invalid input' },
          },
        },
        About: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Display name' },
            title: { type: 'string', description: 'Professional title' },
            summary: { type: 'string', description: 'Short bio' },
            objective: { type: 'string', description: 'Career objective' },
            location: { type: 'string' },
            availability: { type: 'string' },
          },
        },
        SkillCategory: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            items: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
        ExperienceItem: {
          type: 'object',
          properties: {
            company: { type: 'string' },
            role: { type: 'string' },
            period: { type: 'string' },
            location: { type: 'string' },
            tech: {
              type: 'array',
              items: { type: 'string' },
            },
            achievements: {
              type: 'array',
              items: { type: 'string' },
            },
            projects: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  responsibilities: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  links: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        Project: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            summary: { type: 'string' },
            tech: { type: 'array', items: { type: 'string' } },
            highlights: { type: 'array', items: { type: 'string' } },
            links: {
              type: 'object',
              properties: {
                github: { type: 'string' },
                demo: { type: 'string' },
              },
            },
          },
        },
        ContactDetails: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            phone: { type: 'string' },
            location: { type: 'string' },
          },
        },
        ContactMessageRequest: {
          type: 'object',
          required: ['name', 'email', 'message'],
          properties: {
            name: {
              type: 'string',
              description: 'Sender name',
              example: 'Ada Lovelace',
            },
            email: {
              type: 'string',
              description: 'Sender email',
              example: 'ada@example.com',
            },
            message: {
              type: 'string',
              description: 'Message content',
              example: 'Hello, I would like to discuss a project.',
            },
            subject: {
              type: 'string',
              description: 'Optional subject',
              example: 'Project Inquiry',
            },
            phone: {
              type: 'string',
              description: 'Optional phone number',
              example: '+1-555-0100',
            },
          },
        },
        ContactMessageResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'ok' },
            message: {
              type: 'string',
              example: 'Your message has been received.',
            },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'msg_1690000000000_ab12cd' },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
