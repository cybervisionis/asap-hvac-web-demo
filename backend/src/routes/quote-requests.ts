import { Router } from 'express';
import {
  createQuoteRequest,
  deleteQuoteRequest,
  getQuoteRequestById,
  listQuoteRequests,
  updateQuoteRequest
} from '../services/quote-request-service.js';
import { RawQuery } from '../utils/list.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await listQuoteRequests(req.query as RawQuery);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const quoteRequest = await getQuoteRequestById(req.params.id);
    res.json(quoteRequest);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const quoteRequest = await createQuoteRequest(req.body ?? {});
    res.status(201).json(quoteRequest);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const quoteRequest = await updateQuoteRequest(req.params.id, req.body ?? {});
    res.json(quoteRequest);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const quoteRequest = await updateQuoteRequest(req.params.id, req.body ?? {});
    res.json(quoteRequest);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteQuoteRequest(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;