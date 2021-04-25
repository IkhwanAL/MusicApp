import React from 'react';
import data from './dummy';
import { SafeAreaView, View, Text, TouchableOpacity, FlatList } from 'react-native';
import HomeStyle from './screenPageHome.styles';
import PictureView from '../../component/picture/PictureView.component';
import SliderView from '../../component/slider/sliderVIew.component';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ModalStyle from '../modal/screenModalPage.styles';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class HomeView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isPlaying: false,
            File: [],
            refresh: false,
        }
    }

    onHandleClick = () => {
        this.setState((prevState) => {
            return {
                isPlaying: !prevState.isPlaying
            }
        })
    }

    onRefresh() {
        console.log('im in')
        this.setState({ refresh: true })
        // const getItem = await AsyncStorage.getItem('@musicList');
        // console.log()
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
        console.log(this.state);
    }
    renderItem = (props) => {
        const { item } = props;
        return (
            <View style={ModalStyle.List}>
                <TouchableOpacity onPress={() => console.log('Press' + item.id)} >
                    <Text style={{ fontSize: 16 }}>{item.list}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        // const { refresh } = this.state;
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
                        data={data}
                        onScrollEndDrag={this.onRefresh.bind(this)}
                        keyExtractor={(item) => item.id.toString()}
                        removeClippedSubviews={true}
                        refreshing={this.state.refresh}
                        onRefresh={() => this.onRefresh}
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