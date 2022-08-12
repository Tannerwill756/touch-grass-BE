import express from 'express';
import controller from '../controllers/Users';
import { ValidateSchema, Schemas } from '../middleware/ValidateSchame';
import { verifyToken } from '../middleware/VerifyToken';

const router = express.Router();

router.get('/getUser/:userId', verifyToken, controller.readUser);
router.get('/getUserByUsername/:username', verifyToken, controller.getUserByUsername);
router.patch('/updateUser/:userId', verifyToken, ValidateSchema(Schemas.user.update), controller.updateUser);
router.delete('/deleteUser/:userId', verifyToken, controller.deleteUser);

export = router;
