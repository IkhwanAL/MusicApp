import React from 'react';
import { Audio } from 'expo-av'
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import HomeStyle from './screenPageHome.styles';
import PictureView from '../../component/picture/PictureView.component';
import SliderView from '../../component/slider/sliderVIew.component';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ModalStyle from '../modal/screenModalPage.styles';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage'

const { StorageAccessFramework } = FileSystem

export default class HomeView extends React.Component {
    constructor() {
        super()
        this.state = {
            Time: 0,
            isPlaying: false,
            File: [],
            refresh: false,
            musicToPlay: {},
            playbackInstance: null,
            indexFile: null,
            isBuferring: false,
        }
    }

    _isMounted = false;

    async loadAudio() {
        const { isPlaying, musicToPlay } = this.state;
        const playbackInstance = new Audio.Sound();
        if (musicToPlay === null) {
            Alert.alert(
                'Something Error',
                'Please Choose A Music To Play',
                [
                    {
                        text: 'OK',
                        style: 'destructive',
                    }
                ])
            return
        }

        const source = {
            uri: musicToPlay[1]
        };

        const status = {
            shouldPlay: isPlaying
        }
        try {
            // await this.sleep(2000);
            playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
            await playbackInstance.loadAsync(source, status, false);

            this.setState({ playbackInstance });

        } catch (error) {
            await playbackInstance.unloadAsync();
            console.log(error.message);
        }
    }

    onHandleClick = async () => {
        const { isPlaying, playbackInstance } = this.state;
        // console.log(playbackInstance)
        try {
            isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync();

            this.setState({
                isPlaying: !isPlaying,
            })

            const status = await playbackInstance.getStatusAsync();
        } catch (error) {
            console.log(error.message)
        }


    }

    onPlaybackStatusUpdate = status => {
        this.setState({
            isBuferring: status.isBuferring
        })
    }

    sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        })
    }

    onReturnObject = async (callback) => {
        const fetchItem = await AsyncStorage.getItem('@musicList');
        const data = await this.readDirectory(fetchItem);
        const convert = Object.fromEntries(data);
        callback(convert, null);
    }

    onRefresh = () => {
        this.setState({ refresh: true })
        console.log('im in')
        this.onReturnObject((res) => {
            if (this._isMounted) {

                this.setState({
                    File: Object.entries(res),
                    refresh: false
                })
            }
        })
    }

    readDirectory = async (getItem) => {
        if (getItem !== null) {
            const res = JSON.parse(getItem);
            // const arrPath = Object.entries(res);
            // let listPath = [];
            let listMusicFile = [];


            // arrPath.forEach(([key, values]) => {
            //     listPath.push(values.path);
            // })

            try {
                // for (let i = 0; i < listPath.length; i++) {
                //     const file = await StorageAccessFramework.readDirectoryAsync(listPath[i]);
                //     const pushData = listMusicFile.concat(file);
                //     listMusicFile = pushData;
                // }
                for (const [key, values] of Object.entries(res)) {
                    const path = values.path;
                    const file = await StorageAccessFramework.readDirectoryAsync(path);
                    const pushData = listMusicFile.concat(file);
                    listMusicFile = pushData;
                }
            } catch (error) {
                console.log(error.message)
                return
            }
            const extMP3 = listMusicFile.filter(val => {
                if ((typeof val === 'string')) {
                    const title = this.takeTitleFromPath(val);
                    return this.extFileMusic(title);
                }
            })
            return Object.entries(extMP3);
        }
    }

    takeTitleFromPath = (path) => {
        const splitPunctuation = decodeURIComponent(path).split(':');
        const takeLastIndex = splitPunctuation[splitPunctuation.length - 1];
        const searchPunc = takeLastIndex.search('/');
        return takeLastIndex.substr(searchPunc + 1, takeLastIndex.length);
    }

    extFileMusic(val) {
        if (typeof val === 'string') {
            if (val.toLowerCase().includes('.mp3') ||
                val.toLowerCase().includes('.mp4') ||
                val.toLowerCase().includes('.m4a') ||
                val.toLowerCase().includes('.wav') ||
                val.toLowerCase().includes('.aac') ||
                val.toLowerCase().includes('.wma') ||
                val.toLowerCase().includes('.flac')
            ) {
                return true
            }
        }
        return false
    }

    handleButtonPlayPause = () => {
        const { isPlaying } = this.state;
        if (isPlaying) {
            return (
                <TouchableOpacity style={HomeStyle.button} onPress={this.onHandleClick}>
                    <Ionicons name="ios-pause-circle" size={42} color="#E8FFC1" />
                </TouchableOpacity>
            )
        }
        return (
            <TouchableOpacity style={HomeStyle.button} onPress={this.onHandleClick}>
                <Ionicons name="ios-play-circle" size={42} color="#E8FFC1" />
            </TouchableOpacity>
        )
    }

    handleForwardButton = () => {
        const { File, playbackInstance } = this.state;
        if (this._isMounted) {
            playbackInstance.unloadAsync();
            this.setState((prevState) => {
                const { indexFile } = prevState;
                let numIndex = indexFile;
                if (numIndex > File.length - 2) {
                    numIndex = 0;
                } else {
                    numIndex = numIndex + 1;
                }
                return {
                    musicToPlay: File[numIndex],
                    indexFile: numIndex
                }
            }, () => this.loadAudio())

        }
    }

    handlePrevButton = () => {
        const { File, playbackInstance } = this.state;
        if (this._isMounted) {
            playbackInstance.unloadAsync();
            this.setState((prevState) => {
                const { indexFile } = prevState;
                let numIndex = indexFile;
                if (0 >= indexFile) {
                    numIndex = File.length - 1;
                } else {
                    numIndex = numIndex - 1;
                }
                return {
                    musicToPlay: File[numIndex],
                    indexFile: numIndex
                }
            }, () => this.loadAudio())

        }
    }

    async componentDidMount() {
        this._isMounted = true;
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            playsInSilentModeIOS: true,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
            shouldDuckAndroid: true,
            staysActiveInBackground: true,
            playThroughEarpieceAndroid: true,
        })
        this.onReturnObject(res => {
            if (!(typeof res === 'object' || typeof res === 'function')) return
            if (Object.keys(res).length === 0) return

            // let newForm = [];
            // for (const [key, values] in Object.entries(res)) {
            //     let newBlockOfObject = {};
            //     newBlockOfObject['id'] = key;
            //     newBlockOfObject['path'] = res[key];
            //     newForm.push(newBlockOfObject);
            // }
            const forms = Object.entries(res);
            if (this._isMounted) {
                this.setState({
                    File: forms,
                    indexFile: 0,
                    musicToPlay: forms[0],
                });
                this.loadAudio();
            }
        })

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    renderItem = (props) => {
        const { item, index } = props;
        return (
            <View style={ModalStyle.List}>
                <TouchableOpacity >
                    <Text style={{ fontSize: 16 }}>{this.removeExtName(this.takeTitleFromPath(item[1]))}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    removeExtName = (path) => {
        if (typeof path === 'string') {
            const data = path.replace(/\.[^/.]+$/, "");
            return data;
        }
    }

    onConvertTime = async (callback) => {
        const { sound } = this.state;
        if (sound === null) {
            return
        }
        const { durationMillis } = await sound.getStatusAsync();
        // const minutes = Math.floor(durationMillis / 60000);
        // const second = ((durationMillis % 60000) / 1000).toFixed(0);
        // const val = `${minutes}:${(second < 10) ? '0' : ''}${second}`;
        callback(durationMillis, null);
    }

    render() {
        const { refresh, File, musicToPlay, Time } = this.state;
        const title = (musicToPlay.length === 0)
            ? 'No Title'
            : this.removeExtName(this.takeTitleFromPath(musicToPlay[1]));
        // let time;
        this.onConvertTime((val) => {
            this.setState({ Time: val });
        })
        return (
            <SafeAreaView style={HomeStyle.container}>
                <PictureView />
                <SliderView
                    value={Time}
                />
                <View>
                    <Text style={HomeStyle.Title}>
                        {
                            title
                        }
                    </Text>
                </View>
                <View style={HomeStyle.MusicControl}>
                    <TouchableOpacity style={HomeStyle.button} onPress={this.handlePrevButton}>
                        <Ionicons name="ios-play-back" size={42} color="#E8FFC1" />
                    </TouchableOpacity>
                    {
                        this.handleButtonPlayPause()
                    }
                    <TouchableOpacity style={HomeStyle.button} onPress={this.handleForwardButton}>
                        <Ionicons name="ios-play-forward" size={42} color="#E8FFC1" />
                    </TouchableOpacity>
                </View>
                <SafeAreaView style={HomeStyle.FlatListStyle}>
                    <FlatList
                        renderItem={this.renderItem}
                        data={File}
                        onScrollEndDrag={this.onRefresh}
                        keyExtractor={(item, index) => index.toString()}
                        removeClippedSubviews={true}
                        extraData={File}
                        refreshing={refresh}
                        onRefresh={this.onRefresh}
                    />
                </SafeAreaView>
                <View style={HomeStyle.ButtonPlaylistPosition}>
                    <TouchableOpacity style={HomeStyle.ButtonStylePlaylist}>
                        <MaterialCommunityIcons name="playlist-plus" size={42} color="#000" style={HomeStyle.IconStyle} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}