import { Router } from 'express';
import {
  createInspection,
  deleteInspection,
  getInspectionById,
  listInspections,
  updateInspection
} from '../services/inspection-service.js';
import { RawQuery } from '../utils/list.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await listInspections(req.query as RawQuery);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const inspection = await getInspectionById(req.params.id);
    res.json(inspection);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const inspection = await createInspection(req.body ?? {});
    res.status(201).json(inspection);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const inspection = await updateInspection(req.params.id, req.body ?? {});
    res.json(inspection);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const inspection = await updateInspection(req.params.id, req.body ?? {});
    res.json(inspection);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteInspection(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;