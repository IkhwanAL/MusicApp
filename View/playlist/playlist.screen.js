import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    TextInput
} from 'react-native';
import PlaylistStyle from './playlist.styles';

export default class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    state = {

    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { visible, onRequestClose } = this.props;
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onRequestClose}
            >
                <SafeAreaView style={PlaylistStyle.outsideContainer}>
                    <View style={PlaylistStyle.containerView}>
                        <TextInput
                            style={PlaylistStyle.input}
                            placeholder="Create Playlist"
                        />
                        {/* Data Playlist in Database */}
                        {/* End */}
                        <View style={PlaylistStyle.ViewButton}>
                            <TouchableOpacity style={[PlaylistStyle.ButtonStyle, {
                                backgroundColor: 'rgba(255,0,0,0.6)'
                            }]} onPress={onRequestClose}>
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[PlaylistStyle.ButtonStyle, {
                                backgroundColor: 'rgba(35,167,48,0.6)',
                            }]}>
                                <Text>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        )
    }
}