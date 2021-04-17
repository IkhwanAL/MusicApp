import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import ModalStyle from './screenModalPage.styles';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Feather';

export default class ModalView extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { visible, onRequestClose } = this.props;
        return (
            // <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onRequestClose}
            >
                <View style={ModalStyle.ModalView}>
                    <View style={ModalStyle.InsideModalViewStyle}>
                        <View style={ModalStyle.ViewHeader}>
                            <View>
                                <Text style={ModalStyle.TextHeader}>
                                    Now Playing...
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onRequestClose}>
                                <Icon name="close" size={24} color="#FF0000" />
                            </TouchableOpacity>
                        </View>
                        <View style={ModalStyle.List}>
                            <Icon name="addfolder" size={30} color="#000" />
                            <Text style={ModalStyle.TextList}>
                                Add Directory
                            </Text>
                        </View>
                        <View style={ModalStyle.List}>
                            <Icon1 name="list" size={30} color="#000" />
                            <Text style={ModalStyle.TextList}>
                                Choose Playlists
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>
            // </View>
        )
    }
}