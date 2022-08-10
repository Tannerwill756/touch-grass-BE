import express from 'express';
import controller from '../controllers/Scorecard';
import { verifyToken } from '../middleware/VerifyToken';

const router = express.Router();

router.get('/getScorecard/:cardId', controller.GetScorecard);
router.get('/getAllScorecards', verifyToken, controller.GetAllScorecards);
router.get('/getScorecardByCode/:codeId', controller.GetScorecardByCode);
router.post('/createScorecard', controller.CreateScorecard);
router.patch('/updateScorecard/:cardId', controller.UpdateScorecard);
router.delete('/deleteScorecard/:cardId', controller.DeleteScorecard);

export = router;
