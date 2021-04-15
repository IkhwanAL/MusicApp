import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Foundation';
import TopBarStyle from './topBar.styles';

const TopBar = () => {
    return (
        <View style={TopBarStyle.contain}>
            <View>
                <Text style={TopBarStyle.HeaderTextStyle}>
                    Music App
                </Text>
            </View>
            <View>
                <TouchableOpacity style={TopBarStyle.IconButtonStyle}>
                    <Icon name="list" size={32} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default TopBar;