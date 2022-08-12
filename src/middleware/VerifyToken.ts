import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = (req: any, res: Response, next: NextFunction) => {
    try {
        // Bearer tokenstring
        const token = req.cookies.access_token;

        const decoded = jwt.verify(String(token), String(process.env.JWT_SECRET));
        req.userData = decoded;
        next();
    } catch (error: any) {
        if (error.name == 'TokenExpiredError') return res.status(401).json({ status: 'failed', message: 'Your token expired!' });
        return res.status(401).json({ status: 'failed', message: 'Authentication failed' });
    }
};

const verifyRefreshToken = (req: any, res: Response, next: NextFunction) => {
    const refreshToken = req.headers.refresh_token;

    if (refreshToken === null) return res.status(401).json({ status: false, message: 'Invalid request' });

    try {
        const decoded = jwt.verify(String(refreshToken), String(process.env.JWT_REFRESH_SECRET));
        req.userData = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ status: 'failed', message: 'Your session is not valid.', data: error });
    }
};

export { verifyToken, verifyRefreshToken };
