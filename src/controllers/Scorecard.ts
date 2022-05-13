import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Scorecard from '../models/Scorecard';

const CreateScorecard = (req: Request, res: Response, next: NextFunction) => {
    const { players, scores } = req.body;

    const scorecard = new Scorecard({
        _id: new mongoose.Types.ObjectId(),
        players,
        scores
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

const GetAllScorecards = (req: Request, res: Response, next: NextFunction) => {
    Scorecard.find()
        .then((cards) => res.status(200).json({ cards }))
        .catch((error) => res.status(500).json({ error }));
};

const UpdateScorecard = (req: Request, res: Response, next: NextFunction) => {
    console.log(req.params);
    const cardID = req.params.cardId;
    console.log(req.params);

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

export default { CreateScorecard, GetAllScorecards, GetScorecard, UpdateScorecard, DeleteScorecard };
