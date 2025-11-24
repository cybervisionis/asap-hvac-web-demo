import express from 'express';
import customersRouter from './customers.js';

export default function createApiRouter() {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.json({
      name: 'ASAP HVAC API',
      version: '0.1.0',
      resources: ['customers']
    });
  });

  router.use('/customers', customersRouter);

  return router;
}
