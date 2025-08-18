const path = require('path');

// In-memory store for contact messages (ephemeral - replace with DB if needed)
const contactMessages = [];

/**
 * Portfolio data service returning static content.
 * Replace with database calls if integrating with a persistent store.
 */
class PortfolioService {
  // PUBLIC_INTERFACE
  /**
   * Returns the About information for the developer.
   * @returns {object} About object with personal summary and objective
   */
  static getAbout() {
    return {
      name: 'Full Stack Developer',
      title: 'Full Stack Developer (2+ years)',
      summary:
        'Full Stack Developer with 2 years of experience specializing in React.js, Redux, Node.js, Express.js, Java, Sails.js, MongoDB, and MySQL. Passionate about building scalable web applications and delightful user experiences.',
      objective:
        'Seeking to leverage full-stack expertise to deliver impactful digital products and improve engineering velocity.',
      location: 'Remote / Onsite',
      availability: 'Open to opportunities',
    };
  }

  // PUBLIC_INTERFACE
  /**
   * Returns a categorized list of skills and technologies.
   * @returns {object[]} Array of skill categories with related items
   */
  static getSkills() {
    return [
      {
        category: 'Languages',
        items: ['JavaScript (ES6+)', 'Java', 'SQL'],
      },
      {
        category: 'Frontend',
        items: [
          'React.js',
          'Redux',
          'HTML5',
          'CSS3',
          'Sass',
          'Responsive Design',
        ],
      },
      {
        category: 'Backend',
        items: ['Node.js', 'Express.js', 'Sails.js', 'REST APIs', 'JWT/Auth'],
      },
      {
        category: 'Databases',
        items: ['MongoDB', 'MySQL'],
      },
      {
        category: 'Tools & Testing',
        items: ['Git', 'GitHub', 'Docker', 'Postman', 'Jest', 'ESLint'],
      },
    ];
  }

  // PUBLIC_INTERFACE
  /**
   * Returns professional experience timeline entries.
   * @returns {object[]} Array of experience items
   */
  static getExperience() {
    return [
      {
        company: 'Acme Corp',
        role: 'Full Stack Developer',
        period: '2023 - Present',
        location: 'Remote',
        tech: ['React', 'Redux', 'Node.js', 'Express', 'MongoDB', 'MySQL'],
        achievements: [
          'Built and maintained a React/Redux SPA for customer onboarding.',
          'Designed and implemented REST APIs in Node.js/Express.',
          'Improved frontend performance by ~30% through code-splitting and memoization.',
          'Collaborated with designers and product managers to ship features on time.',
        ],
        projects: [
          {
            name: 'Customer Portal',
            description:
              'A self-service portal that enables customers to manage accounts, view usage, and handle billing.',
            responsibilities: [
              'Implemented reusable React components and Redux slices.',
              'Developed backend endpoints for authentication and profile management.',
              'Optimized MongoDB queries and created indexes for critical paths.',
            ],
            links: [],
          },
        ],
      },
      {
        company: 'Tech Solutions',
        role: 'Backend Developer Intern',
        period: '2022 - 2023',
        location: 'Onsite',
        tech: ['Node.js', 'Express', 'Java', 'MySQL'],
        achievements: [
          'Assisted in building RESTful services with Node.js and Express.',
          'Wrote integration tests and improved code quality with ESLint.',
          'Helped migrate data and write stored procedures for MySQL.',
        ],
        projects: [
          {
            name: 'Internal Tools API',
            description:
              'APIs to support internal dashboards and reporting tools.',
            responsibilities: [
              'Implemented endpoints for CRUD operations and reporting.',
              'Added request validation and improved error handling.',
            ],
            links: [],
          },
        ],
      },
    ];
  }

  // PUBLIC_INTERFACE
  /**
   * Returns featured projects with details.
   * @returns {object[]} Array of project items
   */
  static getProjects() {
    return [
      {
        name: 'Project Atlas',
        summary:
          'A project management tool with boards, tasks, sprints, and team collaboration.',
        tech: ['React', 'Redux', 'Node.js', 'Express', 'MongoDB'],
        highlights: [
          'Drag-and-drop task management',
          'Role-based permissions and JWT auth',
          'Real-time updates via polling and cache invalidation',
        ],
        links: {
          github: 'https://github.com/example/project-atlas',
          demo: 'https://demo.example.com/atlas',
        },
      },
      {
        name: 'E-Commerce Platform',
        summary:
          'Scalable e-commerce web application with product search, cart, and checkout.',
        tech: ['React', 'Node.js', 'Express', 'MySQL'],
        highlights: [
          'Server-side pagination and search',
          'Payment workflow integration (mock)',
          'Responsive UI and accessibility improvements',
        ],
        links: {
          github: 'https://github.com/example/ecommerce-platform',
          demo: 'https://demo.example.com/shop',
        },
      },
      {
        name: 'Team Chat App',
        summary:
          'A lightweight team chat application with channels and direct messages.',
        tech: ['React', 'Node.js', 'Express'],
        highlights: [
          'Channels and private conversations',
          'Typing indicators and message read status',
          'Custom hooks and modular state management',
        ],
        links: {
          github: 'https://github.com/example/team-chat',
          demo: 'https://demo.example.com/chat',
        },
      },
    ];
  }

  // PUBLIC_INTERFACE
  /**
   * Returns the public contact details.
   * @returns {{email: string, phone: string, location?: string}}
   */
  static getContact() {
    return {
      email: 'developer@example.com',
      phone: '+1-555-0100',
      location: 'Worldwide',
    };
  }

  // PUBLIC_INTERFACE
  /**
   * Submits a contact message and stores it in an in-memory queue.
   * Replace with database persistence if needed.
   * @param {object} payload
   * @param {string} payload.name
   * @param {string} payload.email
   * @param {string} payload.message
   * @param {string} [payload.subject]
   * @param {string} [payload.phone]
   * @returns {{id: string, createdAt: string}}
   */
  static submitContactMessage(payload) {
    const id = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const createdAt = new Date().toISOString();
    const stored = { id, createdAt, ...payload };
    contactMessages.push(stored);
    return { id, createdAt };
  }

  // PUBLIC_INTERFACE
  /**
   * Returns absolute file path to the resume asset to be downloaded.
   * @returns {string} absolute file path
   */
  static getResumePath() {
    return path.resolve(__dirname, '../../assets/resume.txt');
  }
}

module.exports = PortfolioService;
