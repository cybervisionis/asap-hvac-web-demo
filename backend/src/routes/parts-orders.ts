import { Router } from 'express';
import {
  createPartsOrder,
  deletePartsOrder,
  getPartsOrderById,
  listPartsOrders,
  updatePartsOrder
} from '../services/parts-order-service.js';
import { RawQuery } from '../utils/list.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await listPartsOrders(req.query as RawQuery);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const partsOrder = await getPartsOrderById(req.params.id);
    res.json(partsOrder);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const partsOrder = await createPartsOrder(req.body ?? {});
    res.status(201).json(partsOrder);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const partsOrder = await updatePartsOrder(req.params.id, req.body ?? {});
    res.json(partsOrder);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const partsOrder = await updatePartsOrder(req.params.id, req.body ?? {});
    res.json(partsOrder);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deletePartsOrder(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;