'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    textInputStyle: {
        width: '90%',
        marginBottom: 10,
    },
    boudary: {
        marginBottom: 15,
    },
    buttons: {
        width: '90%',
        marginBottom: 10,
        height: 55,
        justifyContent: 'center',
        borderColor: '#794cfe',
        borderWidth: 2,
    },
    heading: {
        fontSize: 30,
        marginBottom: 20,
    },
    illustration: { position: 'absolute', opacity: 0.2, resizeMode: 'contain', flex: 1, width: '150%', top: '-6%' },
    buttonBottom: {},
});
