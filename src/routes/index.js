import { Router } from 'express';
import authRoutes from './auth-routes.js';
import taskRoutes from './tasks-routes.js';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/task', taskRoutes);

