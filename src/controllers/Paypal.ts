import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import PayPalAuthToken from '../middleware/PaypalAuthToken';
import ScoreComparer from '../middleware/ScoreComparer';
import Paypal from '../models/Paypal';
import Scorecard from '../models/Scorecard';
import Users from '../models/Users';

const Payout = async (req: Request, res: Response, next: NextFunction) => {
    const cardID = req.params.cardId;
    const payoutArr: any = [];
    let resultsObject = {};

    await Scorecard.findById(cardID)
        .exec()
        .then(async (card) => {
            //@ts-ignore
            const results = ScoreComparer(card.scores, card.pricePerHole, card.numHoles); // calls scorecomparer function to get payout for each player
            resultsObject = results;
            for (const username of Object.keys(results)) {
                await Users.findOne({ username: username })
                    .exec()
                    .then((res) => {
                        // searches for each persons in db to retriever their email
                        if (results[username] > 0) {
                            // if they made more than $0 than we pay them out
                            payoutArr.push({
                                amount: {
                                    value: results[username],
                                    currency: 'USD'
                                },
                                sender_item_id: '45033321523',
                                recipient_wallet: 'PAYPAL',
                                receiver: res?.address
                            });
                        }
                    });
            }
        })
        .catch((error) => console.log(error));

    const json_data = {
        sender_batch_header: {
            sender_batch_id: req.params.cardId,
            recipient_type: 'EMAIL',
            email_subject: 'You have money!',
            email_message: 'You received a payout. Thanks for using Touch Grass!'
        },
        items: payoutArr
    };
    let authToken = '';
    await Paypal.find().then((res) => (authToken = res[0].token));
    console.log('data sending  to paypal', json_data);
    try {
        axios
            .post('https://api-m.sandbox.paypal.com/v1/payments/payouts', json_data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                }
            })
            .then((data) => {
                if (data.status === 201) {
                    Scorecard.findById(cardID)
                        .then((card) => {
                            if (card) {
                                card.set({ results: resultsObject });
                                card.save();
                            }
                        })
                        .catch((error) => res.status(500).json({ error }));
                    res.status(201).json({ message: 'Payout Successful', results: resultsObject });
                }
            })
            .catch(async (error) => {
                console.log('Payout ERROR', console.log(error));
                if (error.response.data.name === 'INSUFFICIENT_FUNDS') {
                    res.status(500).json({ message: 'Please contact customer support', error: error.response.data });
                }
                if (error.response.status === 401) {
                    // Then we need to fetch for a new authentication token and recall payout function
                    console.log('token expired getting new token');
                    await PayPalAuthToken();
                    console.log('go the new token');
                    Payout(req, res, next);
                }
                if (error.response.status === 400) res.status(400).json({ message: 'Payout for this card has already been submitted' });
                return;
            });
    } catch (err) {
        console.log('ERROR', err);
    }
};

const getAuth = (req: Request, res: Response, next: NextFunction) => {
    PayPalAuthToken();
    Paypal.find()
        .then((token) => res.status(200).json({ token }))
        .catch((error) => res.status(500).json({ error }));
};

export default { Payout, getAuth };
