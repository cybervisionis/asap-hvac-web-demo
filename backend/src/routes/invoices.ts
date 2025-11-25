import { Router } from 'express';
import {
  createInvoice,
  deleteInvoice,
  getInvoiceById,
  listInvoices,
  listPaymentsForInvoice,
  updateInvoice
} from '../services/invoice-service.js';
import { RawQuery } from '../utils/list.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await listInvoices(req.query as RawQuery);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/payments', async (req, res, next) => {
  try {
    const result = await listPaymentsForInvoice(req.params.id, req.query as RawQuery);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const invoice = await getInvoiceById(req.params.id);
    res.json(invoice);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const invoice = await createInvoice(req.body ?? {});
    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const invoice = await updateInvoice(req.params.id, req.body ?? {});
    res.json(invoice);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const invoice = await updateInvoice(req.params.id, req.body ?? {});
    res.json(invoice);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteInvoice(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;