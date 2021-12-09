import axios from 'axios';
import * as React from 'react';
import { Text, View, Dimensions, Linking, Alert, BackHandler } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { Card, Avatar, Button } from 'react-native-paper';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Marker, Polyline } from 'react-native-maps';
import AppLoading from 'expo-app-loading';
const data = require('./target.json');
const Hospital = (props) => {
    const global = require('../../../globalStyle');
    const styles = require('./Hospital.style');
    const [user] = React.useState(props.user);
    const [myData] = React.useState(data);
    const [location, setLocation] = React.useState({ lat: null, long: null });
    let initial = { title: '', phone: '', address: '', coordinates: {}, distance: 0 };
    const [selected, setSelected] = React.useState(initial);
    const [coordinates, setCoordinates] = React.useState([]);
    const [show, setShow] = React.useState(false);
    const [nearest, setNearest] = React.useState(false);
    // React.useEffect(() => {
    //     _getLocation();
    // }, []);

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

    const _getLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            if (status === 'granted') {
                const locationRes = await Location.getCurrentPositionAsync({});
                setLocation({ lat: locationRes.coords.latitude, long: locationRes.coords.longitude });
            }
        } catch (error) {}
    };

    const goToMarker = (from, to) => {
        setCoordinates([from, to]);
    };

    const getNearest = () => {
        setNearest(true);
    };
    if (location.lat === null || location.long === null) {
        _getLocation();
        return (
            <View style={[global.centerColumn, { marginTop: 50 }]}>
                <Avatar.Icon icon="map-marker-radius-outline" />
                <Text style={[global.fontMedium, { fontSize: 16, paddingTop: 20, paddingBottom: 20 }]}>Location Permission Required</Text>
                <Button icon="refresh" labelStyle={global.fontMedium} onPress={_getLocation} mode="contained">
                    Refresh
                </Button>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    mapType={'standard'}
                    followsUserLocation={true}
                    moveOnMarkerPress={true}
                    showsUserLocation
                    userLocationFastestInterval={5000}
                    initialRegion={{
                        // latitude: 10.298682756102604,
                        // longitude: 123.9036898448735,
                        latitude: location.lat,
                        longitude: location.long,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    showsCompass={true}
                    style={[styles.map]}
                >
                    {myData.map((hospital, index) => {
                        return (
                            <Marker
                                key={index}
                                coordinate={hospital.coordinates}
                                title={hospital.title}
                                // description={hospital.type}
                                onPress={() => {
                                    setShow(false);
                                    setSelected({
                                        ...selected,
                                        title: hospital.title,
                                        phone: hospital.phone,
                                        address: hospital.address,
                                        coordinates: hospital.coordinates,
                                    });
                                    goToMarker(
                                        {
                                            latitude: location.lat,
                                            longitude: location.long,
                                        },
                                        hospital.coordinates
                                    );
                                }}
                            />
                        );
                    })}

                    <MapViewDirections
                        lineDashPattern={[0]}
                        origin={coordinates[0]}
                        destination={coordinates[1]}
                        apikey={'AIzaSyAKNXcAKNMaUFYI4rHsIOOlBy-i2Ex5mm4'} // insert your API Key here
                        strokeWidth={4}
                        strokeColor={show ? '#111111' : 'transparent'}
                        onReady={(resut) => {
                            setSelected({ ...selected, distance: resut.distance });
                        }}
                    />
                </MapView>

                {selected.title === '' ? null : (
                    <View style={styles.card}>
                        <Text style={[global.fontBold, { marginBottom: 3 }]}>{selected.title}</Text>
                        <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={global.fontMedium}>☎️ {selected.phone}</Text>
                            <Text style={global.fontMedium}>📏 {selected.distance} km</Text>
                        </View>
                        <Text style={global.fontMedium}>🗺️ {selected.address}</Text>

                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: 5 }}>
                            <Text style={global.fontMedium}>📌 {selected.coordinates.latitude} || </Text>
                            <Text style={global.fontMedium}>{selected.coordinates.longitude}</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingBottom: 5 }}>
                            <Button
                                icon="directions"
                                mode="contained"
                                style={{ borderColor: '#794cfe', borderWidth: 1, width: '49%' }}
                                labelStyle={global.fontMedium}
                                onPress={() => setShow(true)}
                            >
                                Direction
                            </Button>

                            <Button
                                icon="close-box-outline"
                                style={{ borderColor: '#794cfe', borderWidth: 1, width: '49%' }}
                                labelStyle={global.fontMedium}
                                mode="outlined"
                                onPress={() => setSelected(initial)}
                            >
                                Close
                            </Button>
                        </View>
                        <Button icon="phone-outline" labelStyle={global.fontMedium} onPress={() => Linking.openURL(`tel:${selected.phone}`)}>
                            Emergency Call
                        </Button>
                    </View>
                )}
            </View>
        );
    }
};
export default Hospital;
