import express from 'express';
import controller from '../controllers/Users';
import { ValidateSchema, Schemas } from '../middleware/ValidateSchame';

const router = express.Router();

router.post('/createUser', ValidateSchema(Schemas.user.create), controller.createUser);
router.get('/getUser/:userId', controller.readUser);
router.get('/getUsers', controller.readAll);
router.get('/getUserByUsername/:username', controller.getUserByUsername);
router.patch('/updateUser/:userId', ValidateSchema(Schemas.user.update), controller.updateUser);
router.delete('/deleteUser/:userId', controller.deleteUser);

export = router;
