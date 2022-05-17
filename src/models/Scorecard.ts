import mongoose, { Document, Schema } from 'mongoose';

export interface IScorecard {
    players: Array<string>;
    scores: Array<object>;
}

export interface IScorecardModel extends IScorecard, Document {}

const ScorecardSchema: Schema = new Schema(
    {
        creator: { type: String },
        pricePerHole: { type: Number, required: true },
        numHoles: { type: Number, required: true },
        players: { type: Array, required: true },
        scores: { type: Object }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IScorecardModel>('Scorecard', ScorecardSchema);
