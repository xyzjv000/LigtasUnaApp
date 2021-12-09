import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Image, DrawerLayoutAndroid, StatusBar, ScrollView } from 'react-native';
import { Drawer, IconButton, Avatar, Button, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import Dashboard from '../Pages/Dashboard/Dashboard';
import Feedback from '../Pages/Feedback/Feedback';
import Settings from '../Pages/Settings/Settings';
import Subscription from '../Pages/Subscription/Subscription';
import Bookmark from '../Pages/Bookmark/Bookmark';
import Hospital from '../Pages/Hospital/Hospital';
import axios from 'axios';
const Home = (props) => {
    useEffect(() => {
        hadnleUser();
    }, []);
    const nav_icons = ['home-outline', 'bookmark-outline', 'bell-ring', 'comment-quote-outline', 'hospital-box-outline', 'cog-outline'];
    const navigations = ['Home', 'Bookmark', 'Subscription', 'Feedback', 'Hospital', 'Account Settings'];
    const styles = require('./Home.style');
    const [activeNav, setActiveNav] = useState(navigations[0]);
    const global = require('../../globalStyle');
    const [user, setUser] = useState({});
    const [active, setActive] = React.useState('');
    const [loading, setLoading] = useState(false);
    const hadnleUser = async () => {
        let data = await AsyncStorage.getItem('user');
        setUser(JSON.parse(data));
    };

    const closeDrawer = (nav) => {
        setActiveNav(nav);
        drawer.current.closeDrawer();
    };

    const logout = async () => {
        drawer.current.closeDrawer();
        setLoading(true);
        await AsyncStorage.removeItem('user');

        setTimeout(() => {
            setUser({});
            setLoading(false);
            props.goToWelcome();
        }, 2000);
    };
    const switchPages = () => {
        if (activeNav === 'Home') {
            // props.goToHome();
            return <Dashboard user={user} setActiveNav={setActiveNav} />;
        }
        if (activeNav === 'Bookmark') {
            return <Bookmark user={user} />;
        }
        if (activeNav === 'Subscription') {
            return <Subscription user={user} />;
        }
        if (activeNav === 'Feedback') {
            return <Feedback user={user} />;
        }
        if (activeNav === 'Account Settings') {
            return <Settings user={user} handleUser={hadnleUser} />;
        }
        if (activeNav === 'Hospital') {
            return <Hospital user={user} />;
        }
    };

    const drawer = useRef(null);

    const navigationView = () => (
        <View style={[styles.drawerContainer, styles.navigationContainer]}>
            <View style={styles.drawerHead}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar.Text
                        style={global.fontBold}
                        size={50}
                        label={`${user.user_Fname.charAt(0).toUpperCase()}${user.user_Lname.charAt(0).toUpperCase()}`}
                    />
                    <Text style={[global.fontBold, { color: '#fff', marginLeft: 10, fontSize: 16 }]}>{`${user.user_Fname} ${user.user_Lname}`}</Text>
                </View>
                <IconButton icon="menu" size={35} color="white" onPress={() => drawer.current.closeDrawer()} />
            </View>
            {/* <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}> */}
            {navigations.map((nav, index) => {
                return (
                    <View key={index} style={styles.navItems}>
                        <Button
                            id={index}
                            contentStyle={{
                                width: '100%',
                                height: 50,
                                justifyContent: 'flex-start',
                                paddingLeft: 15,
                                backgroundColor: activeNav === nav ? '#794cfe' : '#fff',
                            }}
                            labelStyle={[{ fontSize: 15, color: activeNav === nav ? '#fff' : '#363537' }, global.fontBold]}
                            style={{ width: '100%' }}
                            icon={nav_icons[index]}
                            onPress={() => closeDrawer(nav)}
                        >
                            {nav}
                        </Button>
                    </View>
                );
            })}
            {/* </View> */}
            <View style={styles.navItems}>
                <Button
                    contentStyle={{
                        width: '100%',
                        height: 50,
                        justifyContent: 'flex-start',
                        paddingLeft: 15,
                        backgroundColor: '#fff',
                    }}
                    labelStyle={[{ fontSize: 15, color: '#363537' }, global.fontBold]}
                    style={{ width: '100%' }}
                    icon="logout-variant"
                    onPress={logout}
                >
                    Logout
                </Button>
            </View>
        </View>
    );

    if (user === null || typeof user.user_Fname === 'undefined') {
        return <AppLoading />;
    } else {
        return (
            <DrawerLayoutAndroid ref={drawer} drawerWidth={300} drawerPosition="left" renderNavigationView={navigationView}>
                <StatusBar backgroundColor="#363537" animated={true} />
                <View style={styles.header}>
                    {/* App Header */}
                    <IconButton icon="menu" size={35} color="white" onPress={() => drawer.current.openDrawer()} />
                    <Text style={[global.fontMedium, { marginRight: 15, fontSize: 20, color: 'white' }]}>LigtasUna</Text>
                </View>
                <ScrollView>
                    <View style={styles.container}>{switchPages()}</View>
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
            </DrawerLayoutAndroid>
        );
    }
};

export default Home;
