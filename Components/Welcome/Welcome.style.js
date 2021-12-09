'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    top: {
        position: 'relative',
        flex: 5,
        height: 200,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottom: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        marginBottom: 10,
    },
    buttons: {
        width: '90%',
        marginBottom: 10,
        height: 55,
        justifyContent: 'center',
        backgroundColor: '#794cfe',
    },

    illustration: {
        width: 240,
        height: 200,
        marginBottom: 10,
        backgroundColor: 'transparent',
        resizeMode: 'contain',
    },
    fontBold: {
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 35,
        color: '#363537',
    },
    illustrationWater: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        resizeMode: 'cover',
        opacity: 0.3,
    },
});
