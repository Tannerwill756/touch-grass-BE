import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/Logging';

const router = express();

// connect to Mongo
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        console.log('Connected to mongoDB!');
    })
    .catch((error) => {
        // Logging.error("Unable to connect: ")
        // Logging.error(error)
    });
