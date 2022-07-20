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
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });
        res.cookie('access_token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        });
        return res.status(200).json({ status: 'Login success', id: user._id, username: user.username, access_token: token });
    } else {
        return res.status(401).json({ status: 'Incorret username or password' });
    }
};

const refreshToken = (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.refresh_token) return res.status(400).json({ message: 'no refresh token found' });
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
                httpOnly: true,
                sameSite: 'none',
                secure: true
            });
            res.cookie('refresh_token', refreshToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: true
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

const logout = (req: Request, res: Response, next: NextFunction) => {
    if (!req.cookies.access_token) return res.sendStatus(204);

    res.clearCookie('access_token', { httpOnly: true, sameSite: 'none', secure: true });
    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'none', secure: true });
    res.sendStatus(204);
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

export default { login, register, refreshToken, logout };
