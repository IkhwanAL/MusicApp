import { StyleSheet, Dimensions } from 'react-native'

const { height, width } = Dimensions.get('window');
export default StyleSheet.create({
    PictureViewer: {
        width: 270,
        height: 270,
        marginTop: height / 13,
    },
    ImageStyle: {
        width: 270,
        borderRadius: 180,
        height: 270,
        position: 'absolute',
    }
})