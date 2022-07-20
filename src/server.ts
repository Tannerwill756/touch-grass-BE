import express, { application, Router } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/Logging';
import cors from 'cors';
import cookieParser from 'cookie-parser';

/* Imported Routes */
import userRoutes from './routes/User';
import scorecardRoutes from './routes/Scorecard';
import authenticationRoutes from './routes/Authentication';

const router = express();

/* Connect to Mongo */
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info('Mongo connected successfully.');
        startServer();
    })
    .catch((error) => {
        Logging.error('Unable to connect: ');
        Logging.error(error);
    });

/* Only start the server if Mongo Connects */
const startServer = () => {
    router.use((req, res, next) => {
        /* Log the Request */
        Logging.info(`Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /* Log the Response */
            Logging.info(`Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.status}]`);
        });

        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    /* Rules of our API */

    const host = process.env.NODE_ENV !== 'development' ? process.env.HOSTED_SITE : process.env.LOCAL_HOST;

    router.use(
        cors({
            origin: host,
            methods: ['PUT', 'POST', 'PATCH', 'DELETE', 'GET'],
            credentials: true
        })
    );

    router.use(cookieParser());

    /* Routes */
    router.use('/users', userRoutes);
    router.use('/scorecards', scorecardRoutes);
    router.use('/auth', authenticationRoutes);

    /* Healthcheck */
    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

    /* Error handling */
    router.use((req, res, next) => {
        const error = new Error('Not Found');
        Logging.error(error);

        return res.status(404).json({ message: error.message });
    });

    http.createServer(router).listen(config.server.port, () => Logging.info(`Server is running on port ${config.server.port}`));
};
