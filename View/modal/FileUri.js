import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Feather';
import FileUriStyle from './fileUri.styles';

const FileUrl = ({ FileUri, iconName, color }) => {
    return (
        <View style={FileUriStyle.ViewStyle}>
            <Text>{FileUri}</Text>
            <TouchableOpacity>
                <Icon name={iconName} size={18} color={color} />
            </TouchableOpacity>
        </View>
    )
}

const renderItem = ({ item }, style) => {
    return (
        <FileUrl itemId={item.id} FileUri={item.list} iconName={style.icon} color={style.color} />
    )
}

export { FileUrl, renderItem };