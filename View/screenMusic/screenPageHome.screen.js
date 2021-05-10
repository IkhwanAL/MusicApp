import React from 'react';
import { Audio } from 'expo-av'
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import HomeStyle from './screenPageHome.styles';
import PictureView from '../../component/picture/PictureView.component';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ModalStyle from '../modal/screenModalPage.styles';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Slider from '@react-native-community/slider';
import SlideStyle from '../../component/slider/sliderView.style';
import { convertMilisToMinutes, convertSecondToMinutes, convertMilisToSecond } from '../../utils/time';

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
        position: 0, // seconds
        duration: 0, // milis
        interval: null,
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
            this.setState({
                playbackInstance: playbackInstance,
            });
            this._getStatus();

        } catch (error) {
            await this.sleep(2000);
            await playbackInstance.unloadAsync();
            console.log(error.message);
        }
    }

    _getStatus = async () => {
        const { playbackInstance } = this.state;
        const { durationMillis } = await playbackInstance.getStatusAsync();
        this.setState({
            duration: durationMillis,
            position: 0,
        })
    }

    onHandleClick = async () => {
        const { isPlaying, playbackInstance, interval } = this.state;
        try {
            if (isPlaying) {
                clearInterval(interval);
                await playbackInstance.pauseAsync();
            }
            if (!isPlaying) {
                this.setState({
                    interval: setInterval(this.updateValuePosition, 1000)
                })
                await playbackInstance.playAsync();
            }

            this.setState({
                isPlaying: !isPlaying,
            })
        } catch (error) {
            await this.sleep(2000);
            await playbackInstance.unloadAsync();
            console.log(error.message)
        }
    }

    onPlaybackStatusUpdate = status => { // Read Buffer in Memory
        if (status.didJustFinish) {
            this.setState({
                position: 0,
            })
            this.handleForwardButton();
        }
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
        if (fetchItem === null) {
            callback(null);
            return
        }
        const data = await this.readDirectory(fetchItem);
        if (data === null) {
            callback(null);
            return
        }
        const convert = Object.fromEntries(data);
        callback(convert);
    }

    onRefresh = () => {
        this.setState({ refresh: true })
        this.onReturnObject((res) => {
            if (res === null) {
                return
            }
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

    handleForwardButton = async () => {
        const { File, playbackInstance } = this.state;
        if (this._isMounted) {
            try {
                await this.sleep(1000);
                await playbackInstance.unloadAsync();

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
                        indexFile: numIndex,
                        position: 0,
                    }
                }, () => this.loadAudio())
            } catch (error) {
                console.log(error.message);
            }
        }
    }

    handlePrevButton = async () => {
        const { File, playbackInstance } = this.state;
        if (this._isMounted) {
            try {
                await this.sleep(1000);
                await playbackInstance.unloadAsync();

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
                        indexFile: numIndex,
                        position: 0,
                    }
                }, () => this.loadAudio())
            } catch (error) {
                console.log(error.message)
            }


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

    componentWillUnmount() {
        this._isMounted = false;
    }

    renderItem = (props) => {
        const { item, index } = props;
        return (
            // <View style={ModalStyle.List} >
            <TouchableOpacity style={ModalStyle.List} onPress={() => this.chooseMusic(index)}>
                <Text style={{ fontSize: 16 }}>{this.removeExtName(this.takeTitleFromPath(item[1]))}</Text>
            </TouchableOpacity>
            // </View>
        )
    }

    text = (index) => {
        console.log('im in 0', index);
    }

    chooseMusic = async (index) => {
        const { File, playbackInstance } = this.state;
        try {
            if (Object.keys(playbackInstance).length !== 0) {
                await playbackInstance.unloadAsync();
            }
            this.setState({
                musicToPlay: File[index],
                position: 0,
                indexFile: index,
            })
            this.loadAudio();

        } catch (error) {
            await this.sleep(1000);
            await playbackInstance.unloadAsync();
            console.log(error.message);
        }
    }

    removeExtName = (path) => {
        if (typeof path === 'string') {
            const data = path.replace(/\.[^/.]+$/, "");
            return data;
        }
    }

    ValueChange = async (val) => {
        const { playbackInstance } = this.state;
        try {
            const value = +val;
            await playbackInstance.setPositionAsync(value * 1000); // mili second

            this.setState({
                position: +value.toFixed(0),
            });
        } catch (error) {
            await this.sleep(2000);
            await playbackInstance.unloadAsync();
            console.log(error.message);
        }
    }

    updateValuePosition = () => {
        if (this._isMounted)
            this.setState((prevState) => {
                return {
                    position: prevState.position + 1,
                }
            })
    }
    render() {
        const { refresh, File, musicToPlay, duration, position, indexFile } = this.state;

        const title = (musicToPlay.length === 0)
            ? 'No Title'
            : this.removeExtName(this.takeTitleFromPath(musicToPlay[1]));

        const seconds = convertMilisToSecond(duration);

        return (
            <SafeAreaView style={HomeStyle.container}>
                <PictureView />
                <View>
                    <Slider
                        minimumValue={0}
                        maximumValue={seconds} // seconds
                        minimumTrackTintColor="#E8FFC1"
                        maximumTrackTintColor="#C4C4C4"
                        thumbTintColor="#FFF"
                        value={position} // second
                        style={SlideStyle.SliderStyle}
                        onValueChange={this.ValueChange}
                    />
                    <View style={SlideStyle.TimelapseText}>
                        <Text>{convertSecondToMinutes(position)}</Text>
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
                        extraData={indexFile}
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