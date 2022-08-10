import mongoose, { Document, Schema } from 'mongoose';

export interface IPaypal {
    token: string;
}

export interface IPaypalModel extends IPaypal, Document {}

const PaypalSchema: Schema = new Schema(
    {
        token: { type: String }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IPaypalModel>('Paypal', PaypalSchema);
