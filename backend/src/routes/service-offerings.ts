import { Router } from 'express';
import {
  listServiceOfferings,
  getServiceOfferingById,
  createServiceOffering,
  updateServiceOffering,
  deleteServiceOffering
} from '../services/service-offering-service.js';
import { RawQuery } from '../utils/list.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await listServiceOfferings(req.query as RawQuery);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const service = await getServiceOfferingById(req.params.id);
    res.json(service);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const service = await createServiceOffering(req.body ?? {});
    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const service = await updateServiceOffering(req.params.id, req.body ?? {});
    res.json(service);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const service = await updateServiceOffering(req.params.id, req.body ?? {});
    res.json(service);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteServiceOffering(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;