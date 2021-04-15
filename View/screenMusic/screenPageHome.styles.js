import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        position: 'relative',
    },
    PictureViewer: {
        width: 300,
        height: 300,
        marginTop: 50,
    },
    ImageStyle: {
        width: 300,
        borderRadius: 180,
        height: 300,
        position: 'absolute',
    }
})