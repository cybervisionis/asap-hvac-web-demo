import { Router } from 'express';
import {
  createFinalQuote,
  deleteFinalQuote,
  getFinalQuoteById,
  listFinalQuotes,
  listInvoicesForFinalQuote,
  listPartsOrdersForFinalQuote,
  updateFinalQuote
} from '../services/final-quote-service.js';
import { RawQuery } from '../utils/list.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await listFinalQuotes(req.query as RawQuery);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/invoices', async (req, res, next) => {
  try {
    const result = await listInvoicesForFinalQuote(req.params.id, req.query as RawQuery);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/parts-orders', async (req, res, next) => {
  try {
    const result = await listPartsOrdersForFinalQuote(req.params.id, req.query as RawQuery);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const finalQuote = await getFinalQuoteById(req.params.id);
    res.json(finalQuote);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const finalQuote = await createFinalQuote(req.body ?? {});
    res.status(201).json(finalQuote);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const finalQuote = await updateFinalQuote(req.params.id, req.body ?? {});
    res.json(finalQuote);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const finalQuote = await updateFinalQuote(req.params.id, req.body ?? {});
    res.json(finalQuote);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteFinalQuote(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;