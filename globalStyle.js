'use strict';
import { StyleSheet } from 'react-native';

module.exports = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    fontBold: {
        fontFamily: 'Montserrat_600SemiBold',
    },
    fontMedium: {
        fontFamily: 'Montserrat_500Medium',
    },
    fontRegular: {
        fontFamily: 'Montserrat_400Regular',
    },
    buttons: {
        width: '90%',
        marginBottom: 10,
        height: 55,
        justifyContent: 'center',
        backgroundColor: '#794cfe',
    },

    buttonContent: {
        height: '100%',
        width: '100%',
    },
    centerRow: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    centerColumn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
