import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Dokumentacja API dla aplikacji Node.js',
    },
    servers: [
      {
        url: 'http://127.0.0.1:3000',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Możesz dodać ten format, ale nie jest to konieczne
        },
      },
    },
    security: [
      {
        BearerAuth: [], // Oznaczenie, że autoryzacja jest wymagana
      },
    ],
  },
  apis: ['./routes/api/*.js'], // Ścieżka do plików z routami API
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default setupSwagger;