import { StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    ModalView: {
        backgroundColor: '#51ADCF',
        marginTop: height / 4,
        height: height,
        padding: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    InsideModalViewStyle: {
        flexDirection: 'column',
        alignContent: 'space-around',
    },
    ViewHeader: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    List: {
        flexDirection: 'row',
        margin: 10,
    },
    TextList: {
        paddingLeft: 50,
        fontSize: 16
    },
    TextHeader: {
        fontSize: 24
    }
})