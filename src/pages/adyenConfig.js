import { AdyenCheckout } from '@adyen/adyen-web';

export const loadAdyenCheckout = async (paymentSession) => {
    const configuration = {
        environment: 'test', // or 'live' for production
        clientKey: 'test_ZGHJ4W3WFZF4LN4DPKUBEIVWZ4TUGUNC', // Get this from Adyen dashboard
        session: {
            id: paymentSession.id,
            sessionData: paymentSession.sessionData,
        },
        countryCode: 'PH', // Specify the country code
        onPaymentCompleted: (result, component) => {
            console.log('Payment completed:', result);
            // Handle payment completion logic here
        },
        onError: (error, component) => {
            console.error('Payment error:', error);
            // Handle error logic here
        },
    };

    // Instantiate AdyenCheckout correctly
    const checkout = new AdyenCheckout(configuration);
    return checkout;
};
