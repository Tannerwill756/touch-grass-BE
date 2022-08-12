import express from 'express';
import controller from '../controllers/Scorecard';
import { verifyToken } from '../middleware/VerifyToken';

const router = express.Router();

router.get('/getScorecard/:cardId', verifyToken, controller.GetScorecard);
router.get('/getAllScorecards', verifyToken, controller.GetAllScorecards);
router.get('/getScorecardByCode/:codeId', verifyToken, controller.GetScorecardByCode);
router.post('/createScorecard', verifyToken, controller.CreateScorecard);
router.patch('/updateScorecard/:cardId', verifyToken, controller.UpdateScorecard);
router.delete('/deleteScorecard/:cardId', verifyToken, controller.DeleteScorecard);

export = router;
