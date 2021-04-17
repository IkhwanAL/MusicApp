import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Foundation';
import ModalView from '../../View/modal/screenModalPage';
import TopBarStyle from './topBar.styles';

const TopBar = () => {
    const [visible, setVisible] = React.useState(false);

    const onClickBar = () => {
        setVisible((prevState) => {
            return {
                visible: !prevState.visible
            }
        })
    }
    const onHandleClose = () => {
        setVisible({ visible: false })
    }
    return (
        <React.Fragment>
            <View style={TopBarStyle.contain}>
                <View>
                    <Text style={TopBarStyle.HeaderTextStyle}>
                        Music App
                    </Text>
                </View>
                <View>
                    <TouchableOpacity style={TopBarStyle.IconButtonStyle} onPress={onClickBar}>
                        <Icon name="list" size={32} color="#fff" />
                    </TouchableOpacity>
                </View>

            </View>
            <ModalView
                visible={visible.visible}
                onRequestClose={onHandleClose}
            />
        </React.Fragment>
    )
}

export default TopBar;