import express from 'express';
import {
  listCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../services/customer-service.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const customers = await listCustomers();
    res.json(customers);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const customer = await getCustomerById(req.params.id);
    res.json(customer);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const customer = await createCustomer(req.body ?? {});
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const customer = await updateCustomer(req.params.id, req.body ?? {});
    res.json(customer);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const customer = await updateCustomer(req.params.id, req.body ?? {});
    res.json(customer);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteCustomer(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
