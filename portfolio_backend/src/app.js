const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

// Initialize express app
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.set('trust proxy', true);

// Build a dynamic OpenAPI spec with correct server URL per request
function buildDynamicOpenAPISpec(req) {
  const host = req.get('host'); // may or may not include port
  let protocol = req.protocol; // http or https
  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  return {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
  };
}

// Serve Swagger UI
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const dynamicSpec = buildDynamicOpenAPISpec(req);
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Serve raw OpenAPI JSON for tooling/clients
app.get('/openapi.json', (req, res) => {
  const dynamicSpec = buildDynamicOpenAPISpec(req);
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(dynamicSpec);
});

// Parse JSON request body
app.use(express.json());

// Mount routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

module.exports = app;
