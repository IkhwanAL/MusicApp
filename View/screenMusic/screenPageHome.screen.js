import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import HomeStyle from './screenPageHome.styles';
import PictureView from '../../component/picture/PictureView.component';
import SliderView from '../../component/slider/sliderVIew.component';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default class HomeView extends React.Component {
    state = {
        isPlaying: false,
    }
    onHandleClick = () => {
        this.setState((prevState) => {
            return {
                isPlaying: !prevState.isPlaying
            }
        })
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
    render() {
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
                <View style={HomeStyle.ButtonPlaylistPosition}>
                    <TouchableOpacity style={HomeStyle.ButtonStylePlaylist}>
                        <MaterialCommunityIcons name="playlist-plus" size={42} color="#000" style={HomeStyle.IconStyle} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}