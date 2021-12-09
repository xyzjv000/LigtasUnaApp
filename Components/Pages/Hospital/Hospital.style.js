'use strict';
import { StyleSheet, Dimensions } from 'react-native';

module.exports = StyleSheet.create({
    container: {
        marginTop: -15,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 83,
        zIndex: 1,
    },
    card: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        minHeight: 100,
        right: 15,
        zIndex: 999,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
    },
});
