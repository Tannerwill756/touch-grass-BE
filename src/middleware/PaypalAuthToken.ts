import axios from 'axios';
import Paypal from '../models/Paypal';
import CryptoJS from 'crypto-js';

const PayPalAuthToken = async () => {
    try {
        const response = await axios.post(
            'https://api-m.sandbox.paypal.com/v1/oauth2/token',
            new URLSearchParams({
                grant_type: 'client_credentials'
            }),
            {
                auth: {
                    username: String(process.env.PAYPAL_CLIENT_ID),
                    password: String(process.env.PAYPAL_CLIENT_SECRET)
                }
            }
        );

        const ciphertext = CryptoJS.AES.encrypt(response.data.access_token, String(process.env.PAYPAL_AUTH_ENCRYPTION_SECRET)).toString();

        const newToken = new Paypal({
            token: ciphertext
        });

        const result = await Paypal.find().exec();

        const objIds = result.map((c) => c._id);

        Paypal.deleteMany({
            _id: {
                $in: objIds
            }
        })
            .then(() => {
                return newToken.save();
            })
            .catch((err) => console.log('err', err));
    } catch (err) {
        console.log(JSON.stringify(err));
    }
};

export default PayPalAuthToken;
