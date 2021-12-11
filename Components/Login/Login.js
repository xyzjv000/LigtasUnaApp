import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Image, ToastAndroid, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, TextInput, ActivityIndicator, Colors } from 'react-native-paper';
const Login = (props) => {
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true); // or some other action
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false); // or some other action
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);
    const styles = require('./Login.style');
    const global = require('../../globalStyle');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [secret, setSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState('LOGIN');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const pageLoader = () => {
        if (page === 'LOGIN') {
            setPage('FORGET');
        } else {
            setPage('LOGIN');
        }
    };

    const Login = async () => {
        setLoading(true);
        try {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            if (reg.test(username) === false) {
                showToast('Invalid Email format');
                setLoading(false);
                return;
            }
            await axios.post('https://ligtasunaapi.azurewebsites.net/api/user/login?type=user', { username: username, password: password }).then((res) => {
                if (res.data.length > 0) {
                    //(res.data[0]);
                    if (res.data[0].status === 'active') {
                        const jsonValue = JSON.stringify(res.data[0]);
                        AsyncStorage.setItem('user', jsonValue);
                        setLoading(false);
                        props.goToHome();
                    }
                    if (res.data[0].status === 'inactive') {
                        showToast('Account not yet apporved by the admin');
                        setLoading(false);
                    }
                    if (res.data[0].status === 'reject') {
                        showToast('Account has been rejected');
                        setLoading(false);
                    }
                } else {
                    setLoading(false);
                    alert('Invalid Credentials!');
                }
            });
        } catch (error) {
            //(error);
        }
    };

    const ForgetPassword = async () => {
        setLoading(true);
        try {
            if (password === '' || cpassword === '' || username === '' || secret === '') {
                showToast('Please fillup all fields!');
                setLoading(false);
            } else if (password.length < 6) {
                showToast('Password must be 6 characters above!');
                setLoading(false);
            } else if (password !== cpassword) {
                showToast("Password didn't match!");
                setLoading(false);
            } else {
                await axios
                    .post(`https://ligtasunaapi.azurewebsites.net/api/user/forget_password?username=${username}&password=${password}&secret=${secret}`)
                    .then((res) => {
                        // console.log(res.data);
                        if (res.data.length > 0 && res.data[0].password === password) {
                            showToast(`Password successfully changed for ${res.data[0].user_Fname}`);
                            setLoading(false);
                            pageLoader;
                        } else {
                            setLoading(false);
                            alert('Invalid username and secret word combination!');
                        }
                    });
            }
        } catch (error) {
            //(error);
        }
    };

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    return (
        <SafeAreaView style={[styles.container, { position: 'relative' }]}>
            <Image style={styles.illustration} source={require('../../assets/login.png')} />
            <Text style={[global.fontBold, styles.heading]}>{page === 'LOGIN' ? 'Login' : 'Forgot Password'}</Text>
            <TextInput
                style={styles.textInputStyle}
                label="Email Address"
                value={username}
                mode="outlined"
                textContentType="emailAddress"
                theme={{ fonts: { regular: global.fontRegular } }}
                onChangeText={(username) => setUsername(username)}
            />
            {page === 'LOGIN' ? null : (
                <TextInput
                    style={[styles.textInputStyle, styles.boudary]}
                    label="Secret word"
                    value={secret}
                    mode="outlined"
                    textContentType="none"
                    onChangeText={(secret) => setSecret(secret)}
                    theme={{ fonts: { regular: global.fontRegular } }}
                />
            )}
            <TextInput
                style={[styles.textInputStyle, styles.boudary]}
                label={page === 'LOGIN' ? 'Password' : 'New Password'}
                value={password}
                mode="outlined"
                textContentType="password"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                theme={{ fonts: { regular: global.fontRegular } }}
            />
            {page === 'LOGIN' ? null : (
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
            )}
            <Button
                mode="outlined"
                labelStyle={[global.fontMedium]}
                style={{ borderWidth: 0, display: page === 'LOGIN' ? 'flex' : 'none' }}
                onPress={pageLoader}
            >
                Forgot Password
            </Button>
            <View
                style={{
                    width: '100%',
                    position: isKeyboardVisible ? 'relative' : 'absolute',
                    bottom: 0,
                    left: '5%',
                    display: isKeyboardVisible ? 'none' : 'flex',
                }}
            >
                <Button
                    icon="login-variant"
                    mode="contained"
                    labelStyle={[global.fontMedium]}
                    contentStyle={global.buttonContent}
                    style={[global.buttons, styles.buttonBottom]}
                    onPress={page === 'LOGIN' ? Login : ForgetPassword}
                >
                    {page === 'LOGIN' ? 'Login' : 'Submit'}
                </Button>
                <Button
                    icon="arrow-left"
                    mode="outlined"
                    labelStyle={[global.fontMedium]}
                    contentStyle={styles.buttonContent}
                    style={[styles.buttons, styles.buttonBottom]}
                    onPress={page === 'LOGIN' ? props.goToWelcome : pageLoader}
                >
                    {page === 'LOGIN' ? 'Back' : 'Back to login'}
                </Button>
            </View>
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

export default Login;
onPress = {};
