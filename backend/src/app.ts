import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import createApiRouter from './routes/index.js';
import swaggerDocument from './swagger/swagger.js';
import { errorHandler, notFoundHandler } from './middleware/error-handlers.js';

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  res.json({
    name: 'ASAP HVAC API',
    version: '0.1.0',
    endpoints: {
      health: '/healthz',
      api: '/api',
      docs: '/docs'
    }
  });
});

app.use('/api', createApiRouter());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.warn(`ASAP HVAC API listening on http://localhost:${port}`); // eslint-disable-line no-console
});

export default app;
