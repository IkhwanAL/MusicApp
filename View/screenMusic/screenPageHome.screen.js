import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import HomeStyle from './screenPageHome.styles';
import PictureView from '../../component/picture/PictureView.component';
import SliderView from '../../component/slider/sliderVIew.component';

export default class HomeView extends React.Component {

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

                <View>
                    <Text>
                        Control Play Music
                    </Text>
                </View>
                <View>
                    <Text>
                        Add To Playlist
                    </Text>
                </View>
            </SafeAreaView>
        )

    }
}