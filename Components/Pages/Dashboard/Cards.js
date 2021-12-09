import * as React from 'react';
import { Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import VideoView from './VideoView';
const Cards = (props) => {
    const global = require('../../../globalStyle');
    const styles = require('./Dashboard.style');

    const viewVideo = () => {
        props.view(props.vidIndex);
    };
    return (
        <Card style={{ position: 'relative', marginBottom: 10 }} onPress={viewVideo}>
            <Card.Cover source={{ uri: props.image }} />
            <View style={styles.viewStyle1}>
                <Text style={[global.fontRegular, { fontSize: 12, color: 'white', textAlign: 'center', padding: 3 }]}>{props._views} Views</Text>
            </View>
            <View style={styles.viewStyle}>
                <Text style={[global.fontBold, { fontSize: 16, color: 'white' }]}>{props.title}</Text>
            </View>
        </Card>
    );
};

export default Cards;
