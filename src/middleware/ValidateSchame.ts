import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import { IUser } from '../models/Users';
import Logging from '../library/Logging';

export const ValidateSchema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);

            next();
        } catch (error) {
            Logging.error(error);
            return res.status(422).json({ error });
        }
    };
};

export const Schemas = {
    user: {
        create: Joi.object<IUser>({
            username: Joi.string().required(),
            password: Joi.string().required(),
            address: Joi.string().required()
        }),
        update: Joi.object<IUser>({
            username: Joi.string(),
            password: Joi.string(),
            address: Joi.string(),
            totalEarnings: Joi.number(),
            winRate: Joi.string(),
            activeScorecards: Joi.array().items(Joi.string())
        })
    }
};
