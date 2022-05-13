import express from 'express';
import controller from '../controllers/Scorecard';

const router = express.Router();

router.get('/getScorecard/:cardId', controller.GetScorecard);
router.get('/getAllScorecards', controller.GetAllScorecards);
router.post('/createScorecard', controller.CreateScorecard);
router.patch('/updateScorecard/:cardId', controller.UpdateScorecard);
router.delete('/deleteScorecard/:cardId', controller.DeleteScorecard);

export = router;
