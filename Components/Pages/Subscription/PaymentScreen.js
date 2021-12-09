import { CardField, useStripe } from '@stripe/stripe-react-native';
import React from 'react';
export default function PaymentScreen() {
    const { confirmPayment } = useStripe();

    return (
        <CardField
            postalCodeEnabled={false}
            placeholder={{
                number: '4242 4242 4242 4242',
            }}
            cardStyle={{
                backgroundColor: '#FFFFFF',
                textColor: '#000000',
                borderColor: 'grey',
                borderRadius: 10,
                borderWidth: 1,
            }}
            style={{
                width: '100%',
                height: 50,
                marginVertical: 10,
            }}
        />
    );
}
