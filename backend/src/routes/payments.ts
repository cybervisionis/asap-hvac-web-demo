import { Router } from 'express';
import {
  createPayment,
  deletePayment,
  getPaymentById,
  listPayments,
  updatePayment
} from '../services/payment-service.js';
import { RawQuery } from '../utils/list.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await listPayments(req.query as RawQuery);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const payment = await getPaymentById(req.params.id);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const payment = await createPayment(req.body ?? {});
    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const payment = await updatePayment(req.params.id, req.body ?? {});
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const payment = await updatePayment(req.params.id, req.body ?? {});
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deletePayment(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;