import express from 'express';
import controller from '../controllers/Paypal';
import { verifyToken } from '../middleware/VerifyToken';

const router = express.Router();

router.post('/payout/:cardId', verifyToken, controller.Payout);
router.get('/auth', verifyToken, controller.getAuth);

export = router;
