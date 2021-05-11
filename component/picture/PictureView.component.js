import React from 'react';
import { View, Image } from 'react-native';
import Picture from './PictureView.styles';

const PictureView = (props) => {
    let uri;
    if (Object.keys(props).length === 0) {
        uri = require('../../assets/e.jpeg');
    }

    return (
        <View style={Picture.PictureViewer}>
            <Image
                style={Picture.ImageStyle}
                source={uri}
            />
        </View>
    )
}


export default PictureView;