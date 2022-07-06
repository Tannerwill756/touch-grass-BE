import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Users from '../models/Users';
import jwt from 'jsonwebtoken';

interface userInterface {
    _id: string;
    username: string;
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    const user = await Users.findOne({
        username: req.body.username,
        password: req.body.password
    });
    console.log('user', user);
    if (user) {
        const token = generateToken(user);
        console.log('token built, returning status and payload');
        return res.status(200).json({ status: 'success', user: token });
    } else {
        console.log('errorr');
    }
};

const register = (req: Request, res: Response, next: NextFunction) => {
    const { username, password, address } = req.body;

    const user = new Users({
        _id: new mongoose.Types.ObjectId(),
        username,
        password,
        address
    });
    let checkUsername = user.username;
    return Users.findOne({ username: checkUsername }, (err: any, data: any) => {
        if (data === null) {
            user.save()
                .then((user) => {
                    res.status(201).json({ user });
                })
                .catch((error) => res.status(500).json({ error }));
        } else {
            res.status(404).json({ message: 'User Already exists' });
        }
    });
};

function generateToken(user: userInterface) {
    const payload = {
        id: user._id,
        username: user.username
    };
    const secret = process.env.JWT_secret || 'supersecret';
    const options = {
        expiresIn: '1d'
    };
    return jwt.sign(payload, secret, options);
}

export default { login, register };
