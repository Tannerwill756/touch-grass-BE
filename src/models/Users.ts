import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
    username: string;
    password: string;
    address: string;
    totalEarnings: number;
    winRate: number;
    activeScorecards: Array<any>;
    invitedScorecards: Array<string>;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        address: { type: String, required: true },
        refreshToken: { type: String },
        totalEarnings: { type: Number },
        winRate: { type: Number },
        activeScorecards: [String]
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IUserModel>('User', UserSchema);
