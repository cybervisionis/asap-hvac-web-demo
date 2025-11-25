import { Router } from 'express';
import appointmentsRouter from './appointments.js';
import customersRouter from './customers.js';
import finalQuotesRouter from './final-quotes.js';
import inspectionsRouter from './inspections.js';
import invoicesRouter from './invoices.js';
import maintenancePlansRouter from './maintenance-plans.js';
import partsOrdersRouter from './parts-orders.js';
import paymentsRouter from './payments.js';
import quoteRequestsRouter from './quote-requests.js';
import serviceOfferingsRouter from './service-offerings.js';

export default function createApiRouter(): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json({
      name: 'ASAP HVAC API',
      version: '0.2.0',
      resources: [
        'customers',
        'service-offerings',
        'maintenance-plans',
        'quote-requests',
        'appointments',
        'inspections',
        'final-quotes',
        'invoices',
        'payments',
        'parts-orders'
      ]
    });
  });

  router.use('/customers', customersRouter);
  router.use('/service-offerings', serviceOfferingsRouter);
  router.use('/maintenance-plans', maintenancePlansRouter);
  router.use('/quote-requests', quoteRequestsRouter);
  router.use('/appointments', appointmentsRouter);
  router.use('/inspections', inspectionsRouter);
  router.use('/final-quotes', finalQuotesRouter);
  router.use('/invoices', invoicesRouter);
  router.use('/payments', paymentsRouter);
  router.use('/parts-orders', partsOrdersRouter);

  return router;
}
