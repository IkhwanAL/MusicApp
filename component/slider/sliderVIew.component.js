import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import SlideStyle from './sliderView.style'

// const [isMounted, setMounted] = React.useState(false);

const convertMilisToMinutes = (milis) => {
    if (milis === null) return '03:24';
    const minutes = Math.floor(milis / 60000);
    const second = determineSecond(milis);
    const val = `${minutes}:${(second < 10 ? '0' : '') + second}`;
    return val;
}

const determineSecond = (milis) => {
    if (milis === null) return
    const seconds = ((milis % 36000) / 1000).toFixed(0);
    return seconds
}

const SliderView = (props) => {
    const _isMounted = props.mounted;
    if (!_isMounted || props.duration === null) {
        return (
            <View>

            </View>
        )
    }
    const seconds = +(props.duration / 1000).toFixed(0)
    return (
        <View>
            <Slider
                minimumValue={0}
                maximumValue={seconds}
                minimumTrackTintColor="#E8FFC1"
                maximumTrackTintColor="#C4C4C4"
                thumbTintColor="#FFF"
                value={0}
                style={SlideStyle.SliderStyle}
                // disabled={true}
                onValueChange={props.onValueChange}
            />
            <View style={SlideStyle.TimelapseText}>
                <Text>00:00</Text>
                <Text>{convertMilisToMinutes(props.duration)}</Text>
            </View>
        </View>
    )
}

export default SliderView