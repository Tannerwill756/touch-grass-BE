import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Users from '../models/Users';

const readUser = (req: Request, res: Response, next: NextFunction) => {
    const userID = req.params.userId;

    return Users.findById(userID)
        .then((user) =>
            user
                ? res.status(200).json({ id: user.id, user: user.username, email: user.address, totalEarnings: user.totalEarnings, activeScorecards: user.activeScorecards })
                : res.status(404).json({ message: 'User not found' })
        )
        .catch((error) => res.status(500).json({ error }));
};
const getUserByUsername = (req: Request, res: Response, next: NextFunction) => {
    const username = req.params.username;

    return Users.findOne({ username: username })
        .then((user) =>
            user
                ? res.status(200).json({ id: user.id, user: user.username, email: user.address, totalEarnings: user.totalEarnings, activeScorecards: user.activeScorecards })
                : res.status(404).json({ message: 'User not found' })
        )
        .catch((error) => res.status(500).json({ error }));
};

const updateUser = (req: Request, res: Response, next: NextFunction) => {
    const userID = req.params.userId;
    return Users.findById(userID)
        .then((user) => {
            if (user) {
                user.set(req.body);
                return user
                    .save()
                    .then((user) => res.status(201).json({ user }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    const userID = req.params.userId;

    return Users.findByIdAndDelete(userID)
        .then((user) => (user ? res.status(201).json({ message: 'Deleted' }) : res.status(404).json({ message: 'User not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { readUser, getUserByUsername, updateUser, deleteUser };
