import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Scorecard from '../models/Scorecard';

const CreateScorecard = (req: Request, res: Response, next: NextFunction) => {
    const { creator, pricePerHole, numHoles, players, scores, status, setNumberOfPlayers } = req.body;
    const accessCode = Math.floor(100000 + Math.random() * 900000);
    const scorecard = new Scorecard({
        _id: new mongoose.Types.ObjectId(),
        creator,
        accessCode,
        pricePerHole,
        numHoles,
        players,
        scores,
        status,
        setNumberOfPlayers
    });

    return scorecard
        .save()
        .then((card) => res.status(201).json({ card }))
        .catch((error) => res.status(500).json({ error }));
};

const GetScorecard = (req: Request, res: Response, next: NextFunction) => {
    const cardID = req.params.cardId;

    return Scorecard.findById(cardID)
        .then((card) => (card ? res.status(200).json({ card }) : res.status(404).json({ message: 'Scorecard not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const GetScorecardByCode = (req: Request, res: Response, next: NextFunction) => {
    const codeID = req.params.codeId;
    console.log(req.params);

    return Scorecard.findOne({ accessCode: codeID })
        .then((card) => (card ? res.status(200).json({ card }) : res.status(404).json({ message: 'Scorecard not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const GetAllScorecards = (req: Request, res: Response, next: NextFunction) => {
    Scorecard.find()
        .then((cards) => res.status(200).json({ cards }))
        .catch((error) => res.status(500).json({ error }));
};

const UpdateScorecard = (req: Request, res: Response, next: NextFunction) => {
    const cardID = req.params.cardId;

    return Scorecard.findById(cardID)
        .then((card) => {
            if (card) {
                card.set(req.body);

                return card
                    .save()
                    .then((card) => res.status(201).json({ card }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: 'Card not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const DeleteScorecard = (req: Request, res: Response, next: NextFunction) => {
    const cardID = req.params.cardId;

    return Scorecard.findByIdAndDelete(cardID)
        .then((card) => (card ? res.status(201).json({ message: 'Deleted' }) : res.status(404).json({ message: 'User not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { CreateScorecard, GetAllScorecards, GetScorecard, GetScorecardByCode, UpdateScorecard, DeleteScorecard };
