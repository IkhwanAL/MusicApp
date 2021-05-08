import { StyleSheet, Dimensions } from 'react-native'

const { height } = Dimensions.get('window');
export default StyleSheet.create({
    PictureViewer: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        marginTop: height / 13,
    },
    ImageStyle: {
        width: 250,
        borderRadius: 180,
        height: 250,
        position: 'absolute',
    }
})