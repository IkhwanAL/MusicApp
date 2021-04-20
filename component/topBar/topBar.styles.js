import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');
export default StyleSheet.create({
    contain: {
        backgroundColor: '#51ADCF',
        width: width,
        padding: 15,
        // For Shadow IOS
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.8,
        shadowColor: '#000',
        // End IOS Shadow
        elevation: 5, // For Android
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    HeaderTextStyle: {
        fontSize: 24,
    },
    IconButtonStyle: {
        // borderColor: '#000',
        // borderWidth: 1,
    }
})