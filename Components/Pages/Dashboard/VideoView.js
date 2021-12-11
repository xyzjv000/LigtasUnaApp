import axios from 'axios';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Text, View, Dimensions, ScrollView, BackHandler, ToastAndroid, Image, Linking, Alert } from 'react-native';
import { Avatar, Button, Card, IconButton, TextInput, Chip } from 'react-native-paper';
import { Video, AVPlaybackStatus } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import moment from 'moment-timezone';
import _moment from 'moment';
import AppLoading from 'expo-app-loading';
function YouTubeGetID(url) {
    var ID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
    } else {
        ID = url;
    }
    return ID;
}

function VideoView(props) {
    const [user, setUser] = useState(props.user);
    const [playing, setPlaying] = useState(false);
    const global = require('../../../globalStyle');
    const styles = require('./Dashboard.style');
    const [videos, setVideo] = useState(props.videoData);
    const [feedback, setFeedback] = useState([]);
    const [bookmark, setBookmark] = useState(null);
    const [subscribe, setSubscribe] = useState(null);
    const [timer, setTimer] = useState(true);
    const [description, setDescription] = useState('');
    // const [feedbackEvent, setFeedbackEvent] = useState(false);

    const getFeedbacks = async () => {
        await axios.get(`https://ligtasunaapi.azurewebsites.net/api/feedback/list?id=${parseInt(props.videoData.id)}`).then((res) => {
            if (res.data.length > 0) {
                let sortedData = res.data.sort(function (a, b) {
                    // Turn your strings into dates, and then subtract them
                    // to get a value that is either negative, positive, or zero.
                    return new Date(b.created) - new Date(a.created);
                });
                setFeedback(sortedData);
            }
        });
    };

    const addFeedback = async () => {
        await axios
            .post(`https://ligtasunaapi.azurewebsites.net/api/feedback`, {
                feed_Descrp: description,
                firstaids: {
                    faidPR_ID: videos.id,
                },
                users: {
                    user_ID: user.user_ID,
                },
            })
            .then((res) => {
                if (res.data.length > 0) {
                    setDescription('');
                    getFeedbacks();
                    showToast('Feedback Posted!');
                }
            });
    };

    const backToPrevPage = () => {
        props.view();
        // //(feedback);
        // //(user);
        return true;
    };

    const onStateChange = useCallback((state) => {
        if (state === 'ended') {
            setPlaying(false);
            Alert.alert('video has finished playing!');
        }
    }, []);

    const togglePlaying = useCallback(() => {
        setPlaying((prev) => !prev);
    }, []);

    let vid_id = YouTubeGetID(videos.video.url);

    const [fullscreen, setFullscreen] = useState(false);
    const fullScreenHandler = (status) => {
        setFullscreen(status);
    };

    const onSubscribe = async () => {
        Alert.alert('Switching to Subscription page!', 'Are you sure?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            { text: 'OK', onPress: () => props.setActiveNav('Subscription') },
        ]);
        return;
        // try {
        //     await axios
        //         .post(`https://ligtasunaapi.azurewebsites.net/api/subscription`, {
        //             users: {
        //                 user_ID: parseInt(user.user_ID),
        //             },
        //         })
        //         .then((res) => {
        //             if (res.data) {
        //                 setSubscribe(true);
        //                 showToast('Subscribed Successfully!');
        //             }
        //         });
        // } catch (error) {
        //     //(error);
        // }
    };

    const onUnsubscribe = async () => {
        Alert.alert('Switching to Subscription page!', 'Are you sure?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            { text: 'OK', onPress: () => props.setActiveNav('Subscription') },
        ]);
        return;
        // try {
        //     await axios.post(`https://ligtasunaapi.azurewebsites.net/api/subscription/unsubscribe?userId=${user.user_ID}`).then((res) => {
        //         if (res.data) {
        //             setSubscribe(false);
        //             showToast('Unsubscribed Successfully!');
        //         }
        //     });
        // } catch (error) {

        // }
    };

    const getSubscribers = async () => {
        await axios.get(`https://ligtasunaapi.azurewebsites.net/api/subscription`).then((res) => {
            if (res.data.length > 0) {
                res.data.forEach((rslt) => {
                    //(rslt.userId, user.user_ID);

                    if (rslt.userId === user.user_ID && _moment().subtract(1, 'month') < _moment(rslt.subDate)) {
                        // && _moment().subtract(1, 'month') > _moment(rslt.subDate)
                        // console.log(_moment('2021-12-30T07:27:37.811Z').subtract(1, 'month'), _moment(rslt.subDate));
                        // compare subdate ug date today
                        // dapat mas dak
                        setSubscribe(true);
                        //(subscribe);
                    } else {
                        setSubscribe(false);
                    }
                });
            } else {
                setSubscribe(false);
            }
        });
    };

    const onBookmark = async () => {
        //('ebookmark');
        try {
            await axios.post(`https://ligtasunaapi.azurewebsites.net/api/bookmark/new?userId=${user.user_ID}&faid=${videos.id}`).then((res) => {
                if (res.data) {
                    setBookmark(true);
                    getBookmarkStatus();
                    showToast('Bookmarked Successfully!');
                }
            });
        } catch (error) {
            //(error);
        }
    };

    const onUnbookmark = async () => {
        try {
            await axios.post(`https://ligtasunaapi.azurewebsites.net/api/bookmark/unbook?userId=${user.user_ID}&faid=${videos.id}`).then((res) => {
                if (res.data) {
                    setBookmark(false);
                    getBookmarkStatus();
                    showToast('Unbookmarked Successfully!');
                }
            });
        } catch (error) {
            //(error);
        }
    };

    const getBookmarkStatus = async () => {
        try {
            await axios.get(`https://ligtasunaapi.azurewebsites.net/api/bookmark?userId=${user.user_ID}&faid=${videos.id}`).then((res) => {
                if (res.data.length > 0) {
                    setBookmark(true);
                } else {
                    setBookmark(false);
                }
            });
        } catch (error) {
            //(error);
        }
    };

    const downloadVideo = async () => {
        try {
            Linking.openURL(`https://ligtasunaapi.azurewebsites.net/api/file/download?fileName=${videos.video.name}.mp4`);
        } catch (error) {
            showToast('Error !');
            throw error;
        }
    };

    const addView = async (_id) => {
        if (!subscribe) {
            setTimeout(() => {
                setTimer(false);
                showToast('You should subscribe to watch the whole video!');
            }, 12000);
        }
        try {
            await axios.post(`https://ligtasunaapi.azurewebsites.net/api/firstaid/add_views?faid=${videos.id}`).then((res) => {
                if (res.data.length > 0) {
                    setVideo({ ...videos, views: (videos.views += 1) });
                }
            });
        } catch (error) {
            showToast('Error !');
            throw error;
        }
    };

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backToPrevPage);

    const emptyField = () => {
        alert('Feedback field is empty');
    };

    if (subscribe === null || bookmark === null) {
        getBookmarkStatus();
        getFeedbacks();
        getSubscribers();
        return <AppLoading />;
    } else {
        return (
            <View>
                <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -16 }]}>
                    {/* <YoutubePlayer
                        height={fullscreen === true ? Dimensions.get('window').height : 200}
                        width={Dimensions.get('window').width}
                        play={playing}
                        videoId={vid_id}
                        onChangeState={onStateChange}
                        onFullScreenChange={(status) => fullScreenHandler(status)}
                    /> */}

                    <Video
                        positionMillis={timer ? 0 : 99999999999999999999999999999999999999999999999}
                        onLoadStart={addView}
                        source={{ uri: videos.video.url }}
                        shouldPlay
                        isMuted={false}
                        useNativeControls
                        resizeMode={fullscreen ? 'contain' : 'cover'}
                        volume={1.0}
                        onError={(error) => showToast('Video file error!')}
                        onFullscreenUpdate={(status) => (status.fullscreenUpdate === 1 ? fullScreenHandler(true) : fullScreenHandler(false))}
                        style={{ height: 220, width: Dimensions.get('window').width, backgroundColor: 'black' }}
                        playableDurationMillis={1000}
                    />
                </View>
                <Text style={[global.fontBold, { fontSize: 20, padding: 5, marginLeft: 0 }]}>{videos.title}</Text>

                <ScrollView horizontal alwaysBounceVertical={true} style={{ flex: 1, flexDirection: 'row', marginBottom: 5 }}>
                    {videos.category.map((cat, index) => {
                        return (
                            <Chip key={index} icon="information" mode="outlined" textStyle={[global.fontMedium, { fontSize: 12, marginRight: 2 }]}>
                                {cat}
                            </Chip>
                        );
                    })}
                </ScrollView>
                <ScrollView>
                    <Text style={[global.fontRegular, { fontSize: 14, marginLeft: 5, color: 'rgba(0,0,0,.7)', textAlign: 'justify' }]}>
                        {videos.description}
                    </Text>
                    {videos.tools ? <Text style={[global.fontRegular, { color: 'rgba(0,0,0,.7)', marginTop: 10 }]}>Tools : {videos.tools}</Text> : null}
                    {videos.medicine ? (
                        <Text style={[global.fontRegular, { color: 'rgba(0,0,0,.7)', marginTop: 10 }]}>Medicine : {videos.medicine}</Text>
                    ) : null}
                    <Text style={[global.fontRegular, { color: 'rgba(0,0,0,.7)', marginTop: 10 }]}>
                        Posted : {moment.tz(videos.created, 'Asia/Manila').tz('America/Los_Angeles').format('lll')} | {videos.views} views
                        {/* {moment.tz(rep.created, 'Asia/Manila').tz('America/Los_Angeles').format('lll')} */}
                    </Text>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button
                            onPress={subscribe ? onUnsubscribe : onSubscribe}
                            icon="bell-ring"
                            mode={subscribe ? 'contained' : 'outlined'}
                            labelStyle={global.fontMedium}
                            style={{ height: 40, borderColor: '#794cfe', borderWidth: 1 }}
                        >
                            {subscribe ? 'Subscribed' : 'Subscribe'}
                        </Button>

                        <View style={{ flexDirection: 'row' }}>
                            <IconButton onPress={downloadVideo} color="#794cfe" icon="download-outline" size={30} disabled={!subscribe} />

                            <IconButton
                                onPress={bookmark === false ? onBookmark : onUnbookmark}
                                color="#794cfe"
                                icon={bookmark ? 'bookmark' : 'bookmark-outline'}
                                size={30}
                                disabled={!subscribe}
                            />
                        </View>
                    </View>
                    <ScrollView horizontal>
                        {videos.image.map((img, index) => {
                            return <Image key={index} style={{ width: 200, height: 100, marginRight: 3, resizeMode: 'contain' }} source={{ uri: img.url }} />;
                        })}
                    </ScrollView>
                    <View style={{ marginTop: 10 }}>
                        <Text style={[global.fontMedium]}>Feedback({feedback.length})</Text>
                        <View>
                            <TextInput
                                style={{ backgroundColor: '#fff', marginLeft: 5, marginRight: 5, marginTop: 10 }}
                                label="Write Feedback"
                                multiline
                                row={3}
                                mode="outlined"
                                theme={{ fonts: { regular: global.fontRegular } }}
                                value={description}
                                onChangeText={(description) => setDescription(description)}
                            />
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    marginTop: 5,
                                    // display: feedbackEvent === true ? 'content' : 'none',
                                }}
                            >
                                <Button labelStyle={global.fontMedium} mode="contained" onPress={description === '' ? emptyField : addFeedback}>
                                    Post
                                </Button>
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
                    </View>
                </ScrollView>
                {/* <Button icon="arrow-left" labelStyle={global.fontBold} mode="contained" onPress={() => console.log(videos)}>
                    videos
                </Button> */}
                <Button icon="arrow-left" labelStyle={global.fontBold} mode="contained" onPress={backToPrevPage}>
                    Back to Home
                </Button>
            </View>
        );
    }
}

export default VideoView;
