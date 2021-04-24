import React from 'react';
import { View, Text, TouchableOpacity, RefreshControl } from 'react-native'
import Icon from 'react-native-vector-icons/Feather';
import FileUriStyle from './fileUri.styles';
import { db } from '../../logic/transaction/addDirectory';

const Delete = (id) => {
    const sql = 'delete from folder where id = ?';
    db.transaction(tx => {
        tx.executeSql(sql, [id], (_, res) => {
            console.log(res);
        });
    }, (er) => console.log(er.message), () => { console.log('delete') });

}

const FileUrl = ({ itemId, FileUri }) => {
    return (
        <View style={FileUriStyle.ViewStyle}>
            <Text>{FileUri}</Text>
            <TouchableOpacity onPress={() => { Delete(itemId) }}>
                <Icon name='minus-circle' size={18} color='#F00' />
            </TouchableOpacity>
        </View>
    )
}

const renderItem = (props) => {
    console.log(props);
    return (
        // <View style={FileUriStyle.View}>
        <FileUrl itemId={props.item.id} FileUri={props.item.directory} />
        // </View>
    )
}

export { FileUrl, renderItem };