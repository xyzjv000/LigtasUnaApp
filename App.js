import * as React from 'react';
import { useEffect, useState } from 'react';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Welcome from './Components/Welcome/Welcome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PermissionsAndroid } from 'react-native';
import { useFonts, Montserrat_400Regular, Montserrat_600SemiBold, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import AppLoading from 'expo-app-loading';
const App = () => {
    // React.useEffect(() => {
    //     checkLoginUser();
    // }, [isLogin]);

    useEffect(() => {
        _getLocation();
        checkIfLogin();
    }, []);

    let [montserrat] = useFonts({
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
    });

    const _getLocation = async () => {
        try {
            const status = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

            if (status) {
                ('PERMISSION  GRANTED');
            } else {
                const getPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                    title: 'LigtasUna App Location Permission',
                    message: 'LigtasUna App needs access to your location ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                });
                //(getPermission);
                //('PERMISSION NOT GRANTED');
            }
        } catch (error) {
            //(error);
        }
    };
    const [user, setUser] = useState({});
    const [screen, setScreen] = React.useState('Welcome');
    // const [isLogin, setIsLogin] = React.useState(false);
    // const checkLoginUser = async () => {
    //     let data = await AsyncStorage.getItem('user');
    //     if (data === null) {
    //         setIsLogin(false);
    //     }
    //     if (data !== null) {
    //         setIsLogin(true);
    //     }
    // };
    const goToLogin = () => {
        setScreen('Login');
    };

    const goToSignup = () => {
        setScreen('Signup');
    };

    const goToWelcome = () => {
        setScreen('Welcome');
    };

    const goToHome = () => {
        setScreen('Home');
    };

    const checkIfLogin = async () => {
        let data = await AsyncStorage.getItem('user');
        //(data);
        setUser(JSON.parse(data));
    };

    const onPageChange = () => {
        if (user === null) {
            if (screen === 'Welcome') {
                return <Welcome goToLogin={goToLogin} goToSignup={goToSignup} />;
            }
            if (screen === 'Login') {
                return <Login goToWelcome={goToWelcome} goToHome={goToHome} />;
            }
            if (screen === 'Signup') {
                return <Signup goToWelcome={goToWelcome} goToHome={goToHome} />;
            }
            if (screen === 'Home') {
                return <Home goToHome={goToHome} goToWelcome={goToWelcome} />;
            }
        } else {
            return <Home goToHome={goToHome} goToWelcome={goToWelcome} />;
        }
    };
    if (!montserrat) {
        return <AppLoading />;
    } else {
        return onPageChange();
    }
};

export default App;
//'#794cfe', '#363537'
