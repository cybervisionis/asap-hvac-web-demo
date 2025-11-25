import { Router } from 'express';
import {
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  listAppointments,
  updateAppointment
} from '../services/appointment-service.js';
import { RawQuery } from '../utils/list.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await listAppointments(req.query as RawQuery);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const appointment = await getAppointmentById(req.params.id);
    res.json(appointment);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const appointment = await createAppointment(req.body ?? {});
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const appointment = await updateAppointment(req.params.id, req.body ?? {});
    res.json(appointment);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const appointment = await updateAppointment(req.params.id, req.body ?? {});
    res.json(appointment);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteAppointment(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;