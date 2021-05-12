import { StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('screen');

export default StyleSheet.create({
    containerView: {
        backgroundColor: '#51ADCF',
        height: height / 3,
        width: width - 40,
        borderRadius: 20,
        alignItems: 'center'
    },
    outsideContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.8,
    },
    input: {
        margin: 20,
        width: width / 1.2,
        height: 20,
        borderWidth: 1,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
    },
    ViewButton: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: width / 1.2,
    },
    ButtonStyle: {
        borderRadius: 40,
        width: 50,
        alignItems: 'center'
    }

})