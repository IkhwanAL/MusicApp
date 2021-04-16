import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    SliderStyle: {
        width: 270,
        marginTop: 30,
    },
    TrackStyle: {
        height: 10,
        borderRadius: 20,
        color: '#EEEEEE',
        borderColor: '#A5ECD7',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    ThumbStyle: {
        backgroundColor: '#EEEEEE',
        width: 20,
        height: 20,
    },
    TimelapseText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})