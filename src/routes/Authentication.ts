import express from 'express';
import controller from '../controllers/Authentication';

const router = express.Router();

router.post('/login', controller.login);
router.post('/refresh-token', controller.refreshToken);
router.post('/register', controller.register);
router.get('/logout', controller.logout);

export = router;
