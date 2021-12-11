import axios from 'axios';
import * as React from 'react';
import { StyleSheet, SafeAreaView, Text, View, Image, BackHandler, Alert } from 'react-native';
import { Button, IconButton, Card, Title, Paragraph, TextInput } from 'react-native-paper';
import Cards from './Cards';
import VideoView from './VideoView';
const Dashboard = (props) => {
    React.useEffect(() => {
        getDashboardItems();
    }, []);
    const global = require('../../../globalStyle');
    const styles = require('./Dashboard.style');
    const [text, setText] = React.useState('');
    const [selected, setSelected] = React.useState(0);
    const [loadedPage, setLoadedPage] = React.useState('Dashboard');
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

    const pageToggler = (val) => {
        if (loadedPage === 'Dashboard') {
            setSelected(val);
            setLoadedPage('Video');
        } else {
            getDashboardItems();
            setLoadedPage('Dashboard');
        }
    };

    const choosePage = () => {
        if (loadedPage === 'Dashboard') {
            return (
                <View style={{ width: '100%' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: -15, marginBottom: 5 }}>
                        <TextInput
                            mode="outlined"
                            label="Search Title"
                            value={text}
                            onChangeText={(text) => {
                                setText(text);
                                filterFunction(DasboardData, text);
                            }}
                            style={{ width: '100%' }}
                            theme={{ fonts: { regular: global.fontRegular } }}
                            right={text === '' ? <TextInput.Icon name="magnify" /> : <TextInput.Icon name="close" onPress={() => setText('')} />}
                        />
                    </View>

                    {text === ''
                        ? DasboardData.map((item, index) => {
                              return (
                                  <Cards
                                      key={index}
                                      status={item._status}
                                      _views={item.views}
                                      vidId={item.id}
                                      vidIndex={index}
                                      title={item.title}
                                      image={item.image[0].url}
                                      view={pageToggler}
                                  />
                              );
                          })
                        : filteredDashboard.map((item, index) => {
                              return (
                                  <Cards
                                      key={index}
                                      _views={item.views}
                                      status={item._status}
                                      vidId={item.id}
                                      vidIndex={index}
                                      title={item.title}
                                      image={item.image[0].url}
                                      view={pageToggler}
                                  />
                              );
                          })}
                    {/* <Button onPress={() => console.log(DasboardData)}>Click me</Button> */}
                </View>
            );
        }
        if (loadedPage === 'Video') {
            return (
                <View style={{ width: '100%' }}>
                    {text === '' ? (
                        <VideoView user={props.user} view={pageToggler} videoData={DasboardData[selected]} setActiveNav={props.setActiveNav} />
                    ) : (
                        <VideoView user={props.user} view={pageToggler} videoData={filteredDashboard[selected]} setActiveNav={props.setActiveNav} />
                    )}
                </View>
            );
        }
    };

    const [DasboardData, setData] = React.useState([]);
    const [filteredDashboard, setFilteredDashboard] = React.useState([]);
    const getDashboardItems = async () => {
        await axios.get(`https://ligtasunaapi.azurewebsites.net/api/firstaid`).then((res) => {
            if (res.data.length > 0) {
                let dataArr = [];
                let counter = 0;
                let dataObj = {
                    category: [],
                    image: [],
                    video: {},
                };
                console.log(res.data);
                res.data.forEach((data) => {
                    counter++;
                    let imgArr = {};
                    if (data.status == 'active') {
                        if (dataObj.category.length < 1) {
                            dataObj.id = data.id;
                            dataObj.created = data.created;
                            dataObj.title = data.title;
                            dataObj.description = data.description;
                            dataObj.video.name = data.vidName;
                            dataObj.video.url = data.vidUrl;
                            dataObj.tools = data.tools;
                            dataObj.medicine = data.medicine;
                            dataObj.category.push(data.category);
                            imgArr.name = data.imgName;
                            imgArr.url = data.imgUrl;
                            dataObj.status = data.status;
                            dataObj.views = data.views;
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
                                dataObj.status = data.status;
                                dataObj.views = data.views;
                            }
                        }
                    }
                    if (counter === res.data.length) {
                        let xcat = [...new Set(dataObj.category)];
                        let ximg = getUnique(dataObj.image, 'url');
                        dataObj.category = xcat;
                        dataObj.image = ximg;
                        dataArr.push(dataObj);
                        dataArr = dataArr.sort((a, b) => {
                            if (a.views === b.views) {
                                return a.title < b.title ? -1 : 1;
                            } else {
                                return a.views > b.views ? -1 : 1;
                            }
                        });

                        // (a.views > b.views ? 1 : b.views > a.views ? -1 : 0)
                        setData(dataArr);
                        // console.log(DasboardData);
                    }
                    // console.log(counter, res.data.length);
                });
            }
        });
    };

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

    const filterFunction = (dataArr, userInput) => {
        var filteredNames = dataArr.filter((x) => {
            return x.title.includes(userInput);
        });
        // console.log(userInput, filteredNames);
        // return filteredNames;
        setFilteredDashboard(filteredNames);
    };

    return choosePage();
};

export default Dashboard;
