import axios from 'axios';
import AppLoading from 'expo-app-loading';
import * as React from 'react';
import { Text, View, Image, ToastAndroid, BackHandler, Alert } from 'react-native';
import { Avatar, Button, Card } from 'react-native-paper';
import Payment from './Payment';
import moment from 'moment';
function Subscription(props) {
    React.useEffect(() => {
        getSubscribers();

        // initStripe({
        //     publishableKey : publishableKey,
        //     merchantIdentifier : 'merchant.identifier'
        // })
    }, []);

    const global = require('../../../globalStyle');
    const styles = require('./Subscription.style');
    const [_page, _setPage] = React.useState('sub');
    const [user, setUser] = React.useState(props.user);
    const [subscribers, setSubscribers] = React.useState(null);

    const getSubscribers = async () => {
        try {
            await axios.get(`https://ligtasunaapi.azurewebsites.net/api/subscription`).then((res) => {
                if (res.data.length > 0) {
                    let result = res.data.filter((subscriber) => subscriber.userId === user.user_ID);
                    if (result && moment().subtract(1, 'month') < moment(result[0].subDate)) {
                        // console.log(result);
                        //&& _moment().subtract(1, 'month') < _moment(result[0].subDate)
                        setSubscribers(result);
                    } else {
                        setSubscribers([]);
                    }
                } else {
                    setSubscribers([]);
                }
            });
        } catch (error) {
            setSubscribers([]);
            throw error;
        }
    };

    const onSubscribe = async () => {
        _setPage('pay');
    };

    const onBack = () => {
        _setPage('sub');
    };

    const _onSub = async () => {
        try {
            await axios
                .post(`https://ligtasunaapi.azurewebsites.net/api/subscription`, {
                    users: {
                        user_ID: parseInt(user.user_ID),
                    },
                })
                .then((res) => {
                    if (res.data) {
                        showToast('Subscribed Successfully');
                        getSubscribers();
                    }
                });
        } catch (error) {
            //(error);
        }
    };

    const onUnsubscribe = () => {
        Alert.alert('LigtasUna Unsubscribe', 'Are you sure you want to cancel your subscription? No refund will be given', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            { text: 'OK', onPress: () => _unsub() },
        ]);
    };
    const _unsub = async () => {
        try {
            await axios.post(`https://ligtasunaapi.azurewebsites.net/api/subscription/unsubscribe?userId=${user.user_ID}`).then((res) => {
                if (res.data) {
                    showToast('Unsubscribed Successfully');
                    getSubscribers();
                }
            });
        } catch (error) {
            //(error);
        }
    };

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    const handleBackButton = () => {
        Alert.alert(
            'Close LigtasUna App',
            'Are you sure you wanna exit the app ?',
            [
                { text: 'No', onPress: () => null, style: 'cancel' },
                { text: 'Yes', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false }
        );
        return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    if (subscribers === null) {
        return <AppLoading />;
    } else {
        if (_page == 'sub') {
            return (
                //         <StripeProvider
                //   publishableKey={publishableKey}
                //   merchantIdentifier="merchant.identifier"
                // >
                <View style={{ width: '100%' }}>
                    <View style={[global.centerRow, { marginTop: 20 }]}>
                        <Avatar.Icon icon="bell-ring" size={35} />
                        <Text style={[global.fontMedium, { fontSize: 22 }]}> Subscription</Text>
                    </View>
                    {subscribers.length > 0 ? (
                        <View style={{ width: '100%', minHeight: 250, marginTop: 20 }}>
                            <Image style={{ resizeMode: 'contain', height: 200, width: '100%' }} source={require('../../../assets/subscribe.png')} />
                            <Text style={[global.fontRegular, { fontSize: 14, margin: 5, textAlign: 'center' }]}>Name</Text>
                            <View style={[global.centerRow]}>
                                <Text style={[global.fontMedium, { fontSize: 20, margin: 5, color: '#794cfe' }]}>{subscribers[0].fname}</Text>
                                <Text style={[global.fontMedium, { fontSize: 20, margin: 5, color: '#794cfe' }]}>{subscribers[0].lname}</Text>
                            </View>
                            <Text style={[global.fontRegular, { fontSize: 14, margin: 5, textAlign: 'center' }]}>Contact Number</Text>
                            <Text style={[global.fontMedium, { fontSize: 20, margin: 5, textAlign: 'center', color: '#794cfe' }]}>{subscribers[0].number}</Text>
                            <Text style={[global.fontRegular, { fontSize: 14, margin: 5, textAlign: 'center' }]}>Status</Text>
                            <Text style={[global.fontMedium, { fontSize: 20, margin: 5, textAlign: 'center', color: '#794cfe' }]}>Subscribed</Text>
                            <Text style={[global.fontRegular, { fontSize: 14, margin: 5, textAlign: 'center' }]}>Subscribed until</Text>
                            <Text style={[global.fontMedium, { fontSize: 20, margin: 5, textAlign: 'center', color: '#794cfe' }]}>
                                {moment(new Date(subscribers[0].subDate)).add(1, 'month').format('lll')}
                            </Text>

                            <Button
                                style={{ margin: 10, height: 40, marginTop: 20 }}
                                contentStyle={{ height: 40 }}
                                labelStyle={global.fontMedium}
                                mode="contained"
                                onPress={onUnsubscribe}
                            >
                                Unsubscribe
                            </Button>
                        </View>
                    ) : (
                        <View style={{ width: '100%', minHeight: 250, marginTop: 20 }}>
                            <Image style={{ resizeMode: 'contain', height: 200, width: '100%' }} source={require('../../../assets/subscribe.png')} />
                            <Text style={[global.fontRegular, { fontSize: 14, margin: 5, textAlign: 'center' }]}>Name</Text>
                            <View style={[global.centerRow]}>
                                <Text style={[global.fontMedium, { fontSize: 20, margin: 5, color: '#794cfe' }]}>{user.user_Fname}</Text>
                                <Text style={[global.fontMedium, { fontSize: 20, margin: 5, color: '#794cfe' }]}>{user.user_Lname}</Text>
                            </View>
                            <Text style={[global.fontRegular, { fontSize: 14, margin: 5, textAlign: 'center' }]}>Contact Number</Text>
                            <Text style={[global.fontMedium, { fontSize: 20, margin: 5, textAlign: 'center', color: '#794cfe' }]}>{user.user_ConNum}</Text>
                            <Text style={[global.fontRegular, { fontSize: 14, margin: 5, textAlign: 'center' }]}>Status</Text>
                            <Text style={[global.fontMedium, { fontSize: 20, margin: 5, textAlign: 'center', color: 'red' }]}>Not Subscribed</Text>
                            <Text style={[global.fontRegular, { fontSize: 14, margin: 5, textAlign: 'center' }]}>Subscribed since</Text>
                            <Text style={[global.fontMedium, { fontSize: 20, margin: 5, textAlign: 'center', color: 'red' }]}>Not Subscribed</Text>

                            <Button
                                style={{ margin: 10, height: 40, marginTop: 20 }}
                                contentStyle={{ height: 40 }}
                                labelStyle={global.fontMedium}
                                mode="contained"
                                onPress={onSubscribe}
                            >
                                Subscribe
                            </Button>
                        </View>
                    )}
                </View>
                // </StripeProvider>
            );
        }

        if (_page == 'pay') {
            return <Payment generateSub={_onSub} back={onBack} />;
        }
    }
}

export default Subscription;
