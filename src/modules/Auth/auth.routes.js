import { Router } from 'express';
import AuthController from './auth.controller';
import verify from '../../middleware/verify';

const router = Router();
// Views
router.get('/', AuthController.renderLogin);
// APIs
router.post('/api/login', AuthController.login);
router.post('/api/users', verify, AuthController.getUsers);
export default router;
