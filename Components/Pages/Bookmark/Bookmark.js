import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { Card, Avatar, Button } from 'react-native-paper';
import Dashboard from '../Dashboard/Dashboard';
import VideoView from '../Dashboard/VideoView';
function Bookmark(props) {
    useEffect(() => {
        getBookmarks();
    }, []);
    const [user, setUser] = useState(props.user);
    const global = require('../../../globalStyle');
    const styles = require('./Bookmark.style');
    const [bookmarks, setBookmarks] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loadedPage, setLoadedPage] = React.useState('Bookmark');
    const getBookmarks = async () => {
        // //(user);
        await axios.get(`https://ligtasunaapi.azurewebsites.net/api/bookmark/one?userId=${user.user_ID}`).then((res) => {
            if (res.data.length > 0) {
                setBookmarks(res.data);
            } else {
                setBookmarks([]);
            }
        });
    };

    function getUnique(arr, comp) {
        // store the comparison  values in array
        const unique = arr
            .map((e) => e[comp])

            // store the indexes of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)

            // eliminate the false indexes & return unique objects
            .filter((e) => arr[e])
            .map((e) => arr[e]);

        return unique;
    }

    const [DasboardData, setData] = React.useState([]);
    const getSelected = async (val, page) => {
        // setSelected(val);
        // //(DasboardData);
        getDashboardItems(val);
    };

    const getDashboardItems = async (val) => {
        await axios.get(`https://ligtasunaapi.azurewebsites.net/api/firstaid`).then((res) => {
            if (res.data.length > 0) {
                let dataArr = [];
                let counter = 0;
                let dataObj = {
                    category: [],
                    image: [],
                    video: {},
                };
                let usersBookmark = res.data.filter((out) => out.id === val);
                // //(usersBookmark);
                usersBookmark.forEach((data) => {
                    counter++;
                    let imgArr = {};
                    if (dataObj.category.length < 1) {
                        dataObj.id = data.id;
                        dataObj.created = data.created;
                        dataObj.title = data.title;
                        dataObj.description = data.description;
                        dataObj.video.name = data.vidName;
                        dataObj.video.url = data.vidUrl;
                        dataObj.category.push(data.category);
                        imgArr.name = data.imgName;
                        imgArr.url = data.imgUrl;
                        dataObj.image.push(imgArr);
                    } else {
                        if (dataObj.id === data.id) {
                            dataObj.category.push(data.category);
                            imgArr.name = data.imgName;
                            imgArr.url = data.imgUrl;
                            dataObj.image.push(imgArr);
                        } else {
                            let xcat = [...new Set(dataObj.category)];
                            let ximg = getUnique(dataObj.image, 'url');
                            dataObj.category = xcat;
                            dataObj.image = ximg;
                            dataArr.push(dataObj);
                            dataObj = {
                                category: [],
                                image: [],
                                video: {},
                            };
                            //
                            dataObj.id = data.id;
                            dataObj.created = data.created;
                            dataObj.title = data.title;
                            dataObj.description = data.description;
                            dataObj.video.name = data.vidName;
                            dataObj.video.url = data.vidUrl;
                            dataObj.category.push(data.category);
                            imgArr.name = data.imgName;
                            imgArr.url = data.imgUrl;
                            dataObj.image.push(imgArr);
                        }
                    }

                    if (counter === usersBookmark.length) {
                        let xcat = [...new Set(dataObj.category)];
                        let ximg = getUnique(dataObj.image, 'url');
                        dataObj.category = xcat;
                        dataObj.image = ximg;
                        dataArr.push(dataObj);
                        setData(dataArr);
                        // //(DasboardData);
                    }
                });
                pageToggler('Video');
            }
        });
    };

    const pageToggler = () => {
        if (loadedPage === 'Bookmark') {
            setLoadedPage('Video');
        } else {
            getBookmarks();
            setLoadedPage('Bookmark');
        }
    };

    const choosePage = () => {
        if (loadedPage === 'Bookmark') {
            return (
                <View style={{ width: '100%' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 20, paddingBottom: 20 }}>
                        <Avatar.Icon icon="bookmark-outline" size={35} />
                        <Text style={[global.fontBold, { fontSize: 22, marginLeft: 5 }]}>Bookmarks{selected}</Text>
                    </View>

                    {bookmarks.length > 0 ? (
                        <View>
                            {bookmarks.map((book, index) => {
                                return (
                                    <View key={index} style={styles.cardStyle}>
                                        <Text style={[global.fontMedium, { padding: 10, textAlign: 'center' }]}>{book.firstaids.faidPR_Name}</Text>
                                        <Text style={[global.fontRegular, { textAlign: 'center', paddingBottom: 5 }]}>
                                            {new Date(book.bookmark_date).toLocaleDateString()}
                                        </Text>
                                        <Button
                                            onPress={() => getSelected(book.firstaids.faidPR_ID)}
                                            mode="outlined"
                                            labelStyle={global.fontMedium}
                                            style={{ padding: 3, margin: 5, borderColor: '#794cfe', borderWidth: 1 }}
                                        >
                                            View
                                        </Button>
                                    </View>
                                );
                            })}
                        </View>
                    ) : (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 400 }}>
                            <Avatar.Icon icon="alert-circle-outline" color="grey" style={{ backgroundColor: 'white' }} size={100} />
                            <Text style={[global.fontMedium, { fontSize: 30, textAlign: 'center', color: 'grey' }]}>
                                You didn't bookmarked anything at the moment
                            </Text>
                        </View>
                    )}
                </View>
            );
        }
        if (loadedPage === 'Video') {
            return (
                <View style={{ width: '100%' }}>
                    <VideoView user={props.user} view={pageToggler} videoData={DasboardData[0]} />
                </View>
            );
        }
    };

    return choosePage();
}

export default Bookmark;
