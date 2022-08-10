import express from 'express';
import controller from '../controllers/Paypal';
// import { verifyToken } from '../middleware/VerifyToken';

const router = express.Router();

router.post('/payout/:cardId', controller.Payout);
router.get('/auth', controller.getAuth);

export = router;
