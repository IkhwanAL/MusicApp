import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import SlideStyle from './sliderView.style'

const SliderView = () => {
    return (
        <View>
            <Slider
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="#E8FFC1"
                maximumTrackTintColor="#C4C4C4"
                thumbTintColor="#FFF"
                style={SlideStyle.SliderStyle}
            />
            <View style={SlideStyle.TimelapseText}>
                <Text>00:00</Text>
                <Text>03:00</Text>
            </View>
        </View>
    )
}

export default SliderView