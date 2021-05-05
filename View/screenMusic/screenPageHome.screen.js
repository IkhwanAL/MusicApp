import React from 'react';
import { Audio } from 'expo-av'
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import HomeStyle from './screenPageHome.styles';
import PictureView from '../../component/picture/PictureView.component';
// import SliderView from '../../component/slider/sliderVIew.component';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ModalStyle from '../modal/screenModalPage.styles';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Slider from '@react-native-community/slider';
import SlideStyle from '../../component/slider/sliderView.style';
import { convertMilisToMinutes } from '../../utils/time';

const { StorageAccessFramework } = FileSystem

export default class HomeView extends React.Component {
    state = {
        isPlaying: false,
        File: [],
        refresh: false,
        musicToPlay: {},
        playbackInstance: null,
        indexFile: null,
        isBuferring: false,
        position: 0,
        duration: 0,
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
            playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
            await playbackInstance.loadAsync(source, status, false);
            // console.log(playbackInstance);
            this.setState({
                playbackInstance: playbackInstance,
            });
            this._getStatus();

        } catch (error) {
            await playbackInstance.unloadAsync();
            console.log(error);
        }
    }

    _getStatus = async () => {
        const { playbackInstance } = this.state;
        const { durationMillis } = await playbackInstance.getStatusAsync();
        this.setState({
            duration: durationMillis
        })
    }

    onHandleClick = async () => {
        const { isPlaying, playbackInstance } = this.state;
        try {
            isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync();

            this.setState({
                isPlaying: !isPlaying,
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    onPlaybackStatusUpdate = status => {
        // console.log(status)
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

            let listMusicFile = [];

            try {

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

    async componentDidUpdate(prevProps, prevState) {
        if (prevState.indexFile === this.state.indexFile) {
            return
        }
        this.loadAudio();
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

    ValueChange = async (val) => {
        const { playbackInstance } = this.state;
        await playbackInstance.setPositionAsync(val * 1000);
    }

    render() {
        const { refresh, File, musicToPlay, duration } = this.state;

        const title = (musicToPlay.length === 0)
            ? 'No Title'
            : this.removeExtName(this.takeTitleFromPath(musicToPlay[1]));

        const seconds = +(duration / 1000).toFixed(0);
        return (
            <SafeAreaView style={HomeStyle.container}>
                <PictureView />
                <View>
                    <Slider
                        minimumValue={0}
                        maximumValue={seconds}
                        minimumTrackTintColor="#E8FFC1"
                        maximumTrackTintColor="#C4C4C4"
                        thumbTintColor="#FFF"
                        value={0}
                        style={SlideStyle.SliderStyle}
                        onValueChange={this.ValueChange}
                    />
                    <View style={SlideStyle.TimelapseText}>
                        <Text>00:00</Text>
                        <Text>{convertMilisToMinutes(duration)}</Text>
                    </View>
                </View>
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