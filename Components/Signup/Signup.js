import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, Image, ScrollView, PermissionsAndroid, View, Alert, ToastAndroid } from 'react-native';
import { Button, TextInput, ActivityIndicator, Colors } from 'react-native-paper';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Signup = (props) => {
    useEffect(() => {
        _getLocation();
    }, []);

    const _getLocation = async () => {
        try {
            const status = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            //(status);
            if (status) {
                // const options = await Location.getForegroundPermissionsAsync();
                //('PERMISSION  GRANTED');
                const userLocation = await Location.getCurrentPositionAsync();
                setLocation({ lat: userLocation.coords.latitude, long: userLocation.coords.longitude });
            } else {
                //('PERMISSION NOT GRANTED');
            }
        } catch (error) {
            //('Error ', error);
        }
    };

    const styles = require('./Signup.style');
    const global = require('../../globalStyle');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [address, setAddress] = useState('');
    const [cnum, setCnum] = useState('');
    const [location, setLocation] = useState({ lat: null, long: null });
    const [loading, setLoading] = useState(false);
    const Signup = async () => {
        setLoading(true);
        let exists = false;
        await axios
            .get('https://ligtasunaapi.azurewebsites.net/api/user?type=user')
            .then((res) => {
                if (res.data.length > 0) {
                    res.data.forEach((usr) => {
                        if (usr.username === username) {
                            exists = true;
                        }
                    });
                }
            })
            .finally(() => {
                try {
                    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
                    if (reg.test(username) === false) {
                        showToast('Invalid Email format');
                        setLoading(false);
                        return;
                    } else if (username === '' || password === '' || cpassword === '' || lastname === '' || cnum === '' || address === '' || firstname === '') {
                        Alert.alert('Check your data', 'Kindly fill all fields!');
                        setLoading(false);
                    } else if (exists) {
                        Alert.alert('Check your data', 'Email Address already taken');
                        setLoading(false);
                    } else if (cnum.length < 10) {
                        Alert.alert('Check your data', 'Invalid Contact Number');
                        setLoading(false);
                    } else if (password.length < 6) {
                        Alert.alert('Check your data', 'Password must be 6 characters above');
                        setLoading(false);
                    } else if (password !== cpassword) {
                        Alert.alert('Check your data', 'Incorrect Password Confirmation');
                        setLoading(false);
                    } else {
                        axios
                            .post('https://ligtasunaapi.azurewebsites.net/api/user?type=user', {
                                user_fname: firstname,
                                user_lname: lastname,
                                user_address: address,
                                user_conNum: cnum,
                                username: username,
                                password: password,
                                location_long: location.long ? location.long.toString() : null,
                                location_lat: location.lat ? location.lat.toString() : null,
                            })
                            .then((res) => {
                                if (res.data.length > 0) {
                                    //(res.data[0]);
                                    // const jsonValue = JSON.stringify(res.data[0]);
                                    // AsyncStorage.setItem('user', jsonValue);
                                    showToast('Account request has been sent, Account can be used after admin accept the request!');
                                    setLoading(false);
                                    props.goToWelcome();
                                } else {
                                    alert('Invalid Credentials!');
                                    setLoading(false);
                                }
                            });
                    }
                } catch (error) {
                    showToast(error);
                }
            });
    };

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };
    return (
        <SafeAreaView style={[styles.container, { position: 'relative' }]}>
            <Image style={styles.illustration} source={require('../../assets/login.png')} />
            <ScrollView style={{ width: '100%', left: '5%' }}>
                <Text style={[global.fontBold, styles.heading]}>Signup</Text>
                <TextInput
                    style={styles.textInputStyle}
                    label="Firstname"
                    value={firstname}
                    mode="outlined"
                    theme={{ fonts: { regular: global.fontRegular } }}
                    onChangeText={(firstname) => setFirstname(firstname)}
                />
                <TextInput
                    style={styles.textInputStyle}
                    label="Lastname"
                    value={lastname}
                    mode="outlined"
                    theme={{ fonts: { regular: global.fontRegular } }}
                    onChangeText={(lastname) => setLastname(lastname)}
                />
                <TextInput
                    style={styles.textInputStyle}
                    label="Contact Number"
                    value={cnum}
                    mode="outlined"
                    theme={{ fonts: { regular: global.fontRegular } }}
                    onChangeText={(cnum) => setCnum(cnum)}
                    keyboardType="number-pad"
                />
                <TextInput
                    style={styles.textInputStyle}
                    label="Address"
                    value={address}
                    mode="outlined"
                    numberOfLines={3}
                    multiline
                    theme={{ fonts: { regular: global.fontRegular } }}
                    onChangeText={(address) => setAddress(address)}
                />
                <TextInput
                    style={styles.textInputStyle}
                    label="Email Address"
                    value={username}
                    mode="outlined"
                    textContentType="username"
                    theme={{ fonts: { regular: global.fontRegular } }}
                    onChangeText={(username) => setUsername(username)}
                />
                <TextInput
                    style={[styles.textInputStyle]}
                    label="Password"
                    value={password}
                    mode="outlined"
                    textContentType="password"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                    theme={{ fonts: { regular: global.fontRegular } }}
                />
                <TextInput
                    style={[styles.textInputStyle, styles.boudary]}
                    label="Confirm Password"
                    value={cpassword}
                    mode="outlined"
                    textContentType="password"
                    secureTextEntry={true}
                    onChangeText={(cpassword) => setCpassword(cpassword)}
                    theme={{ fonts: { regular: global.fontRegular } }}
                />

                <Button
                    icon="login-variant"
                    mode="contained"
                    labelStyle={[global.fontMedium]}
                    contentStyle={global.buttonContent}
                    style={[global.buttons]}
                    onPress={Signup}
                >
                    Signup
                </Button>
                <Button
                    icon="account-plus-outline"
                    mode="outlined"
                    labelStyle={[global.fontMedium]}
                    contentStyle={styles.buttonContent}
                    style={[styles.buttons, styles.buttonBottom]}
                    onPress={props.goToWelcome}
                >
                    Back
                </Button>
            </ScrollView>
            {loading ? (
                <View
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,.2)',
                        position: 'absolute',
                        top: 25,
                        left: 0,
                        zIndex: 1,
                    }}
                    onPress={() => setLoading(false)}
                >
                    <ActivityIndicator style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} animating={true} color="#794cfe" size="large" />
                </View>
            ) : null}
        </SafeAreaView>
    );
};

export default Signup;
