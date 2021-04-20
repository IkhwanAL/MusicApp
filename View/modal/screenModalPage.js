import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    Alert,
} from 'react-native';
import Data from './dummy';
import ModalStyle from './screenModalPage.styles';
import { AntDesign, Feather } from '@expo/vector-icons'
import { renderItem } from './FileUri';
import * as FileSystem from 'expo-file-system';
const { StorageAccessFramework } = FileSystem;

export default class ModalView extends React.Component {
    constructor(props) {
        super(props);
    }

    handlePress = async () => {
        try {
            const permission = await StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (!permission.granted) {
                Alert.alert(
                    "Permission Forbidden",
                    "Msg",
                    [
                        {
                            text: "Ok",
                            style: 'destructive',
                            onPress: () => { console.log("Ok ") }
                        }
                    ]
                )
                return
            }
            if (!permission.directoryUri) {
                Alert.alert(
                    "You Does Not Choose Directory",
                    "Msg",
                    [
                        {
                            text: "Ok",
                            style: 'destructive',
                            onPress: () => { console.log("Ok ") }
                        }
                    ]
                )
                return
            }
            const create = await StorageAccessFramework.createFileAsync(permission.directoryUri, "test", '.mp3');
            console.log(create);
        } catch (error) {
            console.log(error);
        }


    }
    render() {
        const { visible: { visible }, onRequestClose } = this.props;
        return (
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
                                <AntDesign name="close" size={24} color="#FF0000" />
                            </TouchableOpacity>
                        </View>
                        <View style={ModalStyle.List}>
                            <AntDesign name="addfolder" size={30} color="#000" />
                            <TouchableOpacity onPress={this.handlePress}>
                                <Text style={ModalStyle.TextList}>
                                    Add Directory
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <SafeAreaView style={ModalStyle.ListView}>
                            <FlatList
                                data={Data}
                                ListHeaderComponent={
                                    () => <Text style={{
                                        marginHorizontal: 4,
                                        fontSize: 16
                                    }}>List Directory</Text>
                                }
                                renderItem={(item) => renderItem(item, { icon: "minus-circle", color: "#F00" })}
                                keyExtractor={item => item.id.toString()}
                            />
                        </SafeAreaView>
                        <View style={ModalStyle.List}>
                            <Feather name="list" size={30} color="#000" />
                            <Text style={ModalStyle.TextList}>
                                Choose Playlists
                            </Text>
                        </View>
                        <SafeAreaView style={ModalStyle.ListView}>
                            <FlatList
                                data={Data}
                                ListHeaderComponent={
                                    () => <Text style={{
                                        marginHorizontal: 4,
                                        fontSize: 16
                                    }}>List Playlist</Text>
                                }
                                renderItem={(item) => renderItem(item, { icon: "check", color: "#23A730" })}
                                keyExtractor={item => item.id.toString()}
                            />
                        </SafeAreaView>
                    </View>
                </View>
            </Modal>
        )
    }
}