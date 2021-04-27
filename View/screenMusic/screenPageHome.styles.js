import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        // paddingVertical: 20,
    },
    Title: {
        fontSize: 24,
        margin: 10,
    },
    MusicControl: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    button: {
        shadowColor: '#000',
        elevation: 5,
        // backgroundColor: '#0278AE',
        shadowOpacity: 1,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        padding: 10,
    },
    ButtonPlaylistPosition: {
        alignItems: 'flex-end',
        width: width,
        position: 'absolute',
        right: 13,
        top: height - 100,
    },
    ButtonStylePlaylist: {
        elevation: 5,
        borderRadius: 180,
        width: 65,
        height: 65,
        alignItems: 'center',
        justifyContent: 'center',
    },
    IconStyle: {
        top: 5,
        left: 3,
        borderRadius: 180,
    },
    FlatListStyle: {
        backgroundColor: 'rgba(165, 236, 215, 0.6)',
        height: 150,
        borderRadius: 10,
        width: width,
        marginVertical: 10,
    }
})