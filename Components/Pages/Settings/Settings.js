import { Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import axios from 'axios';
import * as React from 'react';
import { Text, View, BackHandler, Alert, ToastAndroid } from 'react-native';
// import { Notifications } from 'expo';
import { Card, Switch, Avatar, List, TextInput, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import NotificationPage from './NotificationPage';
function Settings(props) {
    React.useEffect(() => {
        handleNotification();
        getSubscribers();
    }, []);

    const handleNotification = async () => {
        let result = await AsyncStorage.getItem('notif');
        result === null ? setIsSwitchOn(false) : setIsSwitchOn(true);
    };

    const global = require('../../../globalStyle');
    const styles = require('./Settings.style');
    const registerForPushNotificationsAsync = async () => {
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            const jsonValue = JSON.stringify(token);
            await AsyncStorage.setItem('notif', jsonValue);
            // setState({ expoPushToken: token });
            let result = await AsyncStorage.getItem('notif');
            //(JSON.parse(result));
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    };
    const [user, setUser] = React.useState(props.user);
    const [firstname, setFirstname] = React.useState(user.user_Fname);
    const [lastname, setLastname] = React.useState(user.user_Lname);
    const [username, setUsername] = React.useState(user.username);
    const [secret, setSecret] = React.useState(user.secret);
    const [cnum, setCnum] = React.useState(user.user_ConNum);
    const [address, setAddress] = React.useState(user.user_Address);
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = async () => {
        if (isSwitchOn) {
            await AsyncStorage.removeItem('notif');
            try {
                await axios
                    .put(`https://ligtasunaapi.azurewebsites.net/api/user/remove_token`, { user_ID: user.user_ID })
                    .then((res) => showToast('Notification Disabled'));
                setIsSwitchOn(false);
            } catch (error) {
                // console.log(error);
                showToast(error.message);
            }
        }

        if (!isSwitchOn) {
            await registerForPushNotificationsAsync();
            try {
                let result = await AsyncStorage.getItem('notif');
                let token = JSON.parse(result);
                await axios
                    .put(`https://ligtasunaapi.azurewebsites.net/api/user/update_token`, { token: token, user_ID: user.user_ID })
                    .then((res) => showToast('Notification Enabled'));
                setIsSwitchOn(true);
            } catch (error) {
                showToast(error.message);
            }
        }
    };

    const [expanded, setExpanded] = React.useState(true);
    const handlePress = () => setExpanded(!expanded);

    const [editProfileButton, setEditProfileButton] = React.useState(false);
    const [editPassButton, setEditPassButton] = React.useState(false);

    const checkNotif = async () => {
        let result = await AsyncStorage.getItem('notif');
        // console.log(JSON.parse(result));
    };

    const updateProfile = async () => {
        setEditProfileButton(true);
        // console.log(secret);
        let exists = false;
        await axios.get('https://ligtasunaapi.azurewebsites.net/api/user?type=user').then((res) => {
            if (res.data.length > 0) {
                let results = res.data.filter((usr) => usr.username === username);
                // //(results[0].user_ID, user.user_ID);
                if (results.length > 0) {
                    if (results[0].user_ID !== user.user_ID) {
                        //Username already taken
                        exists = true;
                    }
                }
                // res.data.forEach((usr) => {
                //     if (usr.username === username) {
                //         exists = true;
                //     }
                // });
            }
        });
        // //(user);

        if (username === '' || lastname === '' || cnum === '' || address === '' || firstname === '') {
            showToast('Kindly fill all fields!');
        } else if (exists) {
            showToast('Email Address already taken');
        } else if (cnum.length < 10) {
            showToast('Invalid Contact Number!');
        } else {
            try {
                await axios
                    .put(`https://ligtasunaapi.azurewebsites.net/api/user/update`, {
                        user_Fname: firstname,
                        user_Lname: lastname,
                        user_Address: address,
                        user_ConNum: cnum,
                        username: username,
                        secret: secret,
                        user_ID: user.user_ID,
                    })
                    .then(async (res) => {
                        if (res.data.length > 0) {
                            // res.data[0].password = user.password;
                            const jsonValue = JSON.stringify(res.data[0]);
                            await AsyncStorage.setItem('user', jsonValue);
                            let data = await AsyncStorage.getItem('user');
                            // //('dataaaaaaa ==========', data);
                            let final = JSON.parse(data);
                            // //('finallllllllll ==========', final);
                            props.handleUser();
                            showToast('Profile Updated Successfully');
                        }
                    });
            } catch (error) {
                setEditProfileButton(false);
            }
        }

        setEditProfileButton(false);
    };

    const updatePassword = async () => {
        setEditPassButton(true);
        if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
            showToast('All field required!');
        } else if (oldPassword !== user.password) {
            showToast('Current Password is Incorrect!');
        } else if (newPassword.length < 6 || confirmPassword.length < 6) {
            showToast('Password must be 6 characters above');
        } else if (newPassword !== confirmPassword) {
            showToast('Incorrect Password Confirmation');
        } else {
            try {
                await axios
                    .put(`https://ligtasunaapi.azurewebsites.net/api/user/update_password`, { password: newPassword, user_ID: user.user_ID })
                    .then(async (res) => {
                        if (res.data.length > 0) {
                            const jsonValue = JSON.stringify(res.data[0]);
                            await AsyncStorage.setItem('user', jsonValue);
                            let data = await AsyncStorage.getItem('user');
                            let final = JSON.parse(data);
                            props.handleUser();
                            showToast('Password Successfully Changed');
                        }
                        if (res.data.length > 0) {
                            showToast('Password Successfully Changed');
                        }
                    });
            } catch (error) {
                setEditPassButton(false);
            }
        }

        setEditPassButton(false);
    };

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    const [subscribers, setSubscribers] = React.useState([]);

    const getSubscribers = async () => {
        try {
            await axios.get(`https://ligtasunaapi.azurewebsites.net/api/subscription`).then((res) => {
                if (res.data.length > 0) {
                    let result = res.data.filter((subscriber) => subscriber.userId === user.user_ID);
                    if (result) {
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

    return (
        <View style={{ width: '90%' }}>
            <View style={[global.centerRow, { marginTop: 20, marginBottom: 10 }]}>
                <Avatar.Icon icon="cog-outline" size={35} />
                <Text style={[global.fontMedium, { fontSize: 22 }]}> Settings</Text>
            </View>

            {subscribers.length > 0 ? (
                <View style={[global.centerRow, { justifyContent: 'space-between', marginTop: 20, marginBottom: 20 }]}>
                    <Text style={[global.fontMedium, { fontSize: 16 }]}>Notifications</Text>
                    <Switch color="#794cfe" value={isSwitchOn} onValueChange={onToggleSwitch} />
                </View>
            ) : null}

            <List.Accordion style={{ backgroundColor: 'white' }} titleStyle={global.fontMedium} title="👤 Edit Profle">
                <TextInput
                    theme={{ fonts: { regular: global.fontRegular } }}
                    mode="outlined"
                    label="First Name"
                    value={firstname}
                    onChangeText={(firstname) => setFirstname(firstname)}
                />
                <TextInput
                    theme={{ fonts: { regular: global.fontRegular } }}
                    mode="outlined"
                    label="Last Name"
                    value={lastname}
                    onChangeText={(lastname) => setLastname(lastname)}
                />
                <TextInput
                    theme={{ fonts: { regular: global.fontRegular } }}
                    mode="outlined"
                    label="Contact Number"
                    value={cnum}
                    keyboardType="number-pad"
                    onChangeText={(cnum) => setCnum(cnum)}
                />
                <TextInput
                    theme={{ fonts: { regular: global.fontRegular } }}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    label="Address"
                    value={address}
                    onChangeText={(address) => setAddress(address)}
                />
                <TextInput
                    theme={{ fonts: { regular: global.fontRegular } }}
                    mode="outlined"
                    label="Email Address"
                    value={username}
                    onChangeText={(username) => setUsername(username)}
                />
                <TextInput
                    theme={{ fonts: { regular: global.fontRegular } }}
                    mode="outlined"
                    label="Secret word"
                    value={secret}
                    onChangeText={(secret) => setSecret(secret)}
                />
                <Button
                    loading={editProfileButton}
                    icon="content-save-outline"
                    style={{ height: 50, marginTop: 10 }}
                    labelStyle={global.fontMedium}
                    contentStyle={{ height: 50 }}
                    mode="contained"
                    onPress={updateProfile}
                >
                    Save
                </Button>
            </List.Accordion>

            <List.Accordion style={{ backgroundColor: 'white' }} titleStyle={global.fontMedium} title="🔑 Change Password">
                <View>
                    <TextInput
                        theme={{ fonts: { regular: global.fontRegular } }}
                        style={{ width: '100%' }}
                        mode="outlined"
                        label="Current Password"
                        textContentType="password"
                        secureTextEntry={true}
                        value={oldPassword}
                        onChangeText={(oldPassword) => setOldPassword(oldPassword)}
                    />
                </View>
                <View>
                    <TextInput
                        theme={{ fonts: { regular: global.fontRegular } }}
                        style={{ width: '100%' }}
                        mode="outlined"
                        label="New Password"
                        textContentType="password"
                        secureTextEntry={true}
                        value={newPassword}
                        onChangeText={(newPassword) => setNewPassword(newPassword)}
                    />
                </View>
                <View>
                    <TextInput
                        theme={{ fonts: { regular: global.fontRegular } }}
                        style={{ width: '100%' }}
                        mode="outlined"
                        label="Confirm New Password"
                        textContentType="password"
                        secureTextEntry={true}
                        value={confirmPassword}
                        onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                    />
                </View>
                <Button
                    loading={editPassButton}
                    icon="content-save-outline"
                    style={{ height: 50, marginTop: 10 }}
                    labelStyle={global.fontMedium}
                    contentStyle={{ height: 50 }}
                    mode="contained"
                    onPress={updatePassword}
                >
                    Save
                </Button>
            </List.Accordion>
            {/* <Button onPress={checkNotif}>Check Storage</Button> */}
            <NotificationPage />
        </View>
    );
}

export default Settings;
