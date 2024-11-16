import express from 'express';
import saveFlow from '../controllers/email.controller.js';

const router = express.Router();

router.post('/save', saveFlow);

export default router;