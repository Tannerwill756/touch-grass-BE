import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Users from '../models/Users';
import jwt, { verify } from 'jsonwebtoken';

interface userInterface {
    _id: string;
    username: string;
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    const user = await Users.findOne({
        username: req.body.username,
        password: req.body.password
    });
    if (user && user.password === req.body.password) {
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie('refresh_token', refreshToken, {
            httpOnly: process.env.NODE_ENV !== 'development',
            secure: false
        });
        res.cookie('access_token', token, {
            httpOnly: process.env.NODE_ENV !== 'development',
            secure: false
        });
        return res.status(200).json({ status: 'Login success', id: user._id, username: user.username, access_token: token });
    } else {
        return res.status(401).json({ status: 'Incorret username or password' });
    }
};

const refreshToken = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refresh_token;

    jwt.verify(refreshToken, String(process.env.JWT_REFRESH_SECRET), (err: any, decode: any) => {
        const user: { _id: string; username: string } = {
            _id: decode.id,
            username: decode.username
        };
        if (err) {
            res.status(400).json({ err });
        } else {
            const token = generateToken(user);
            const refreshToken = req.cookies.refresh_token;
            res.cookie('access_token', token, {
                httpOnly: process.env.NODE_ENV !== 'development',
                secure: false
            });
            res.cookie('refresh_token', refreshToken, {
                httpOnly: process.env.NODE_ENV !== 'development',
                secure: false
            });
            res.status(200).json({
                status: 'Token refreshed successfully',
                access_token: token
            });
        }
    });
};

const register = (req: Request, res: Response, next: NextFunction) => {
    const { username, password, address } = req.body;

    const user = new Users({
        _id: new mongoose.Types.ObjectId(),
        username,
        password,
        address
    });
    const checkUsername = user.username;
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
    const secret = String(process.env.JWT_SECRET);
    const options = {
        expiresIn: String(process.env.JWT_ACCESS_TIME)
    };
    return jwt.sign(payload, secret, options);
}

function generateRefreshToken(user: userInterface) {
    const payload = {
        id: user._id,
        username: user.username
    };
    const secret = String(process.env.JWT_REFRESH_SECRET);
    const options = {
        expiresIn: String(process.env.JWT_REFRESH_TIME)
    };
    return jwt.sign(payload, secret, options);
}

export default { login, register, refreshToken };
