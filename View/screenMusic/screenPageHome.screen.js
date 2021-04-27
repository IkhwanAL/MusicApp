import React from 'react';
import { Audio } from 'expo-av'
import { SafeAreaView, View, Text, TouchableOpacity, FlatList } from 'react-native';
import HomeStyle from './screenPageHome.styles';
import PictureView from '../../component/picture/PictureView.component';
import SliderView from '../../component/slider/sliderVIew.component';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ModalStyle from '../modal/screenModalPage.styles';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage'

const { StorageAccessFramework } = FileSystem

export default class HomeView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isPlaying: false,
            File: {},
            refresh: false,
            musicToPlay: null,
            sound: null,
        }
        // this.readDirectory = this.readDirectory.bind(this);
    }

    onHandleClick = async () => {
        console.log("Loading Sound");

        const musicSound = new Audio.Sound();
        const { musicToPlay, isPlaying, sound } = this.state;
        const { id, path } = musicToPlay;

        // if (sound !== null) {
        //     console.log('Sound Already Played');
        //     return
        // }

        if (isPlaying) {
            if (sound !== null) {
                this.setState({
                    isPlaying: false
                })
                sound.get
                await sound.pauseAsync();
            }
        }

        await musicSound.loadAsync({ uri: path });
        if (!isPlaying) {
            this.setState({
                isPlaying: true
            })
            if (!musicToPlay) {
                console.log("Choose A Music");
                return
            }

            try {
                await musicSound.playAsync();
                this.setState({
                    sound: musicSound
                })
            } catch (error) {
                console.log(error.message);
            }
        }

    }

    onReturnObject = async (callback) => {
        const fetchItem = await AsyncStorage.getItem('@musicList');
        const data = await this.readDirectory(fetchItem);
        const convert = Object.fromEntries(data);
        callback(convert, null);
    }

    onRefresh = () => {
        this.setState({ refresh: true })
        this.onReturnObject(res => {
            this.setState({
                File: res,
                refresh: false
            })
        })
    }

    readDirectory = async (getItem) => {
        if (getItem !== null) {
            let res = JSON.parse(getItem);
            const arrPath = Object.entries(res);
            let listPath = [];
            arrPath.forEach(([key, values]) => {
                listPath.push(values.path);
            })

            let listMusicFile = [];
            try {
                for (let i = 0; i < listPath.length; i++) {
                    const file = await StorageAccessFramework.readDirectoryAsync(listPath[i]);
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
                val.toLowerCase().includes('.mp3') ||
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
    componentDidMount() {
        this.onReturnObject(res => {
            let newForm = [];
            for (const [key, values] in Object.entries(res)) {
                let newBlockOfObject = {};
                newBlockOfObject['id'] = key;
                newBlockOfObject['path'] = res[key];
                newForm.push(newBlockOfObject);
            }
            this.setState({
                File: newForm,
                musicToPlay: newForm[0]
            })
        })
    }
    renderItem = (props) => {
        const { item: { id, path } } = props;
        return (
            <View style={ModalStyle.List}>
                <TouchableOpacity >
                    <Text style={{ fontSize: 16 }}>{this.takeTitleFromPath(path)}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    componentWillUnmount() {
        this.setState({
            isPlaying: false,
            File: {},
            refresh: false,
            musicToPlay: null,
            sound: null,
        });
    }

    render() {
        const { refresh, File } = this.state;
        return (
            <SafeAreaView style={HomeStyle.container}>
                <PictureView />
                <SliderView />
                <View>
                    <Text style={HomeStyle.Title}>
                        Colors
                    </Text>
                </View>
                <View style={HomeStyle.MusicControl}>
                    <TouchableOpacity style={HomeStyle.button}>
                        <Ionicons name="ios-play-back" size={42} color="#E8FFC1" />
                    </TouchableOpacity>
                    {
                        this.handleButtonPlayPause()
                    }
                    <TouchableOpacity style={HomeStyle.button}>
                        <Ionicons name="ios-play-forward" size={42} color="#E8FFC1" />
                    </TouchableOpacity>
                </View>
                <SafeAreaView style={HomeStyle.FlatListStyle}>
                    <FlatList
                        renderItem={this.renderItem}
                        data={File}
                        onScrollEndDrag={this.onRefresh}
                        keyExtractor={(item, index) => item.id.toString()}
                        removeClippedSubviews={true}
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