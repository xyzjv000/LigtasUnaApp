import React from 'react';
import { StripeProvider, useConfirmPayment } from '@stripe/stripe-react-native';
import PaymentScreen from './PaymentScreen';
import { Button, Text, TextInput } from 'react-native-paper';
import { Alert } from 'react-native';
import AppLoading from 'expo-app-loading';
import axios from 'axios';
const pub = 'pk_test_51K11lAFbFEwbMsJJHPl48nX6darpVdJ7B1d1QcayBO6m8b6VGMcZqXlI4tz8P2PTdbjBAXh0bO64HGePryXRtAr6004UCzpWHX';
const merch_id = 'merchant.com.LigtasUna';
function Payment(props) {
    const global = require('../../../globalStyle');
    const styles = require('./Subscription.style');
    const { confirmPayment, loading } = useConfirmPayment();
    const [name, setName] = React.useState('');
    const handleSubmit = async () => {
        // const stripe = require('stripe')('sk_test_51K11lAFbFEwbMsJJZCBdPE16SOOIrz6jzGbVPZxAg98Kwd0jaJb7pSY9trz0h0dlAM7L8jGJSn9uuyk2Rbzdwjm400oWSdXb4y');

        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount: 2000,
        //     currency: 'aud',
        //     payment_method_types: ['card'],
        // });

        // const response = await fetch(`http://localhost:19002/create-payment-intent`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         paymentMethodType: 'card',
        //         currency: 'php',
        //         amount: 50,
        //     }),
        // });

        await axios.post(`https://ligtasunaapi.azurewebsites.net/api/payment`).then(async (res) => {
            const { client_secret } = res.data;
            const { error, paymentIntent } = await confirmPayment(client_secret, {
                type: 'Card',
                billingDetails: { name },
            });
            if (error) {
                Alert.alert(`Error :`, error.message);
            } else if (paymentIntent) {
                Alert.alert('Success', `Congratulations you are now a LigtasUna Subscriber!`);
                props.generateSub();
                props.back();
            }
        });
    };

    return (
        <StripeProvider publishableKey={pub} merchantIdentifier={merch_id}>
            <Text style={[global.fontBold, { fontSize: 18, margin: 5, textAlign: 'center' }]}>Subscription Payment Details</Text>
            <Text style={[global.fontRegular, { fontSize: 14, margin: 5, textAlign: 'center' }]}>Total Payment : ₱ 249</Text>
            <TextInput
                mode="outlined"
                label="Name / Email"
                value={name}
                style={{ width: '100%', height: 45, backgroundColor: 'white' }}
                theme={{ fonts: { regular: global.fontRegular } }}
                onChangeText={(name) => {
                    setName(name);
                }}
            />
            <PaymentScreen />
            <Button
                style={{ width: '100%', margin: 10, height: 40, marginTop: 20 }}
                contentStyle={{ height: 40 }}
                labelStyle={global.fontMedium}
                mode="contained"
                disabled={name.length < 1 ? true : false}
                onPress={handleSubmit}
                loading={loading}
            >
                Confirm
            </Button>
            <Button
                style={{ width: '100%', margin: 10, height: 40, marginTop: 0, backgroundColor: 'white', borderWidth: 1, borderColor: '#794cfe' }}
                contentStyle={{ height: 40 }}
                labelStyle={[global.fontMedium, { color: '#794cfe' }]}
                mode="contained"
                disabled={loading}
                onPress={() => props.back()}
            >
                Cancel
            </Button>
        </StripeProvider>
    );
}

export default Payment;
