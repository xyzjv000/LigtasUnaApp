import axios from 'axios';
import * as React from 'react';
import { Text, View, BackHandler, Alert } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
function Feedback(props) {
    React.useEffect(() => {
        getFeedbacks();
    }, []);

    const global = require('../../../globalStyle');
    const styles = require('./Feedback.style');

    const [user, setUser] = React.useState(props.user);
    const [feedback, setFeedback] = React.useState([]);

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

    const getFeedbacks = async () => {
        await axios.get(`https://ligtasunaapi.azurewebsites.net/api/feedback/list_user?id=${parseInt(user.user_ID)}`).then((res) => {
            if (res.data.length > 0) {
                let sortedData = res.data.sort(function (a, b) {
                    return new Date(b.created) - new Date(a.created);
                });
                setFeedback(sortedData);
            }
        });
    };
    return (
        <View style={{ width: '100%' }}>
            <View style={[global.centerRow, { marginTop: 20 }]}>
                <Avatar.Icon icon="comment-quote-outline" size={35} />
                <Text style={[global.fontMedium, { fontSize: 22 }]}> Feedbacks</Text>
            </View>
            <View style={{ width: '100%', marginTop: 10 }}>
                {feedback.map((feed, index) => {
                    return (
                        <Card key={index} style={{ marginBottom: 10 }} mode="outlined">
                            <View style={{ flex: 1, flexDirection: 'row', padding: 10, alignItems: 'center' }}>
                                <Avatar.Text label={`${feed.fname.charAt(0).toUpperCase()}${feed.lname.charAt(0).toUpperCase()}`} size={45} />
                                <View style={{ flex: 1, flexDirection: 'row', marginLeft: 5 }}>
                                    <View>
                                        <Text style={[global.fontBold]}>
                                            {feed.fname} {feed.lname}
                                        </Text>
                                        <Text style={[global.fontRegular, { fontSize: 12 }]}>Feedback on : {feed.title}</Text>
                                        <Text style={global.fontRegular}>{new Date(feed.created).toLocaleDateString()}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ padding: 10, paddingTop: 0 }}>
                                <Text style={[{ textAlign: 'justify' }, global.fontRegular]}>{feed.description}</Text>
                            </View>
                        </Card>
                    );
                })}
            </View>
        </View>
    );
}

export default Feedback;
