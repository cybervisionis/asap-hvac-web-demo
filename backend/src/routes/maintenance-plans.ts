import { Router } from 'express';
import {
  createMaintenancePlan,
  deleteMaintenancePlan,
  getMaintenancePlanById,
  listMaintenancePlans,
  updateMaintenancePlan
} from '../services/maintenance-plan-service.js';
import { RawQuery } from '../utils/list.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await listMaintenancePlans(req.query as RawQuery);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const plan = await getMaintenancePlanById(req.params.id);
    res.json(plan);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const plan = await createMaintenancePlan(req.body ?? {});
    res.status(201).json(plan);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const plan = await updateMaintenancePlan(req.params.id, req.body ?? {});
    res.json(plan);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const plan = await updateMaintenancePlan(req.params.id, req.body ?? {});
    res.json(plan);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteMaintenancePlan(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;