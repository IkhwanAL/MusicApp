import React from 'react';
import { View, Image } from 'react-native';
import Picture from './PictureView.styles';

const PictureView = () => {
    return (
        <View style={Picture.PictureViewer}>
            <Image
                style={Picture.ImageStyle}
                source={require('../../assets/e.jpeg')}
            />
        </View>
    )
}

export default PictureView;