import React from 'react';
import { SafeAreaView, View, Text, Image } from 'react-native';
import HomeStyle from './screenPageHome.styles';
import PictureView from '../../component/picture/PictureView.component';

export default class HomeView extends React.Component {
    render() {
        return (
            <SafeAreaView style={HomeStyle.container}>
                <PictureView />
                <View>
                    <Text>
                        Time
                    </Text>
                </View>
                <Text>
                    Title
                </Text>
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