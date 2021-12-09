import React from 'react';
import AppLoading from 'expo-app-loading';
import { SafeAreaView, Text, View, Image, Dimensions } from 'react-native';
// import { useFonts, Montserrat_400Regular, Montserrat_600SemiBold, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { Button, Card } from 'react-native-paper';

const Welcome = (props) => {
    // let [montserrat] = useFonts({
    //     Montserrat_400Regular,
    //     Montserrat_500Medium,
    //     Montserrat_600SemiBold,
    // });
    const styles = require('./Welcome.style');
    const global = require('../../globalStyle');
    // if (!montserrat) {
    //     return <AppLoading />;
    // } else {
    return (
        <SafeAreaView style={[global.container, { position: 'relative' }]}>
            <Image style={styles.illustrationWater} source={require('../../assets/health2.png')} />
            <View style={styles.top}>
                {/* <View style={{ height: 12, position: 'absolute', width: Dimensions.get('window').width, backgroundColor: 'red', top: '45%' }}></View> */}
                <Image style={styles.illustration} source={require('../../assets/icon.png')} />
                <Text adjustsFontSizeToFit style={[styles.fontBold]}>
                    LigtasUna
                </Text>
            </View>
            <View style={styles.bottom}>
                <Button
                    icon="login-variant"
                    mode="contained"
                    labelStyle={[global.fontMedium]}
                    contentStyle={global.buttonContent}
                    style={global.buttons}
                    onPress={props.goToLogin}
                >
                    Login
                </Button>
                <Button
                    icon="account-plus-outline"
                    mode="contained"
                    labelStyle={[global.fontMedium]}
                    contentStyle={global.buttonContent}
                    style={global.buttons}
                    onPress={props.goToSignup}
                >
                    Signup
                </Button>
            </View>
        </SafeAreaView>
    );
    // }
};

export default Welcome;
