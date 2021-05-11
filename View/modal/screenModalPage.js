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
import { db, insertFolder } from '../../controller/transaction/addDirectory';
import ModalStyle from './screenModalPage.styles';
import { AntDesign, Feather } from '@expo/vector-icons'
import FileUriStyle from './fileUri.styles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as FileSystem from 'expo-file-system';
const { StorageAccessFramework } = FileSystem;

export default class ModalView extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    state = {
        Folder: [],
    }

    _isMounted = false;

    async selectFolder() {
        const SQLQuery = "select * from folder";
        db.transaction(tx => {
            tx.executeSql(SQLQuery, [], async (_, res) => {
                const { _array, length } = res.rows;
                if (length < 0) {
                    console.log("Data Not Found");
                    return
                }
                this.setState({ Folder: _array })
                await AsyncStorage.setItem('@musicList', JSON.stringify(_array));
            })
        });
    }

    Delete = (id) => {
        const sql = 'delete from folder where id = ?';
        db.transaction(tx => {
            tx.executeSql(sql, [id], async () => {
                if (this._isMounted) {
                    this.setState((prevState) => {
                        const { Folder } = prevState;
                        const data = Object.entries(Folder); // Multi Dimension Array
                        const res = data.filter(([key, values]) => {
                            return values.id === id
                        });
                        const newRes = Object.fromEntries(res);
                        return {
                            Folder: newRes
                        }
                    }, async function () {
                        await AsyncStorage.setItem('@musicList', JSON.stringify(this.state.Folder))
                    })
                }
            });
        }, (er) => console.log(er.message), () => {
            console.log('Success Delete')
        });

    }
    componentDidMount() {
        this._isMounted = true;
        const call = async () => {
            await this.selectFolder();
        }
        call();

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        const call = async () => {
            await this.selectFolder();
        }
        if (prevState.Folder.length !== this.state.Folder.length) {
            call()
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    FileUrl = (itemId, FileUri) => {
        return (
            <View style={FileUriStyle.ViewStyle}>
                <Text>{FileUri}</Text>
                <TouchableOpacity onPress={() => { this.Delete(itemId) }}>
                    <Feather name='minus-circle' size={18} color='#F00' />
                </TouchableOpacity>
            </View>
        )
    }

    renderItem = (props) => {
        return (
            this.FileUrl(props.item.id, props.item.directory)
        )
    }

    handlePress = async () => {
        try {
            const permission = await StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (!permission.granted) {
                Alert.alert(
                    "Permission Forbidden",
                    "Permission To Access Directory is not Granted",
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
                    "Failed To Select Directory",
                    "You Did not Choose Any Directory",
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
            const uri = permission.directoryUri;
            const root = uri.split('%3A');

            if (!root.indexOf('%2F')) {
                await insertFolder(decodeURIComponent(root[root.length - 1]), uri);
                return
            }

            const subFolder = root[1].split('%2F');
            await insertFolder(decodeURIComponent(subFolder[subFolder.length - 1]), uri)
            await this.selectFolder();
            return
        } catch (error) {
            console.log(error.message);
        }
    }

    render() {
        const { Folder } = this.state;
        const { visible, onRequestClose } = this.props;
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
                            <TouchableOpacity onPress={this.handlePress} style={{ marginHorizontal: 20 }}>
                                <Text style={ModalStyle.TextList}>
                                    Add Directory
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <SafeAreaView style={ModalStyle.ListView}>
                            <FlatList
                                data={Folder}
                                ListHeaderComponent={
                                    () => <Text style={{
                                        marginHorizontal: 4,
                                        fontSize: 16
                                    }}>List Directory</Text>
                                }
                                renderItem={this.renderItem}
                                keyExtractor={item => item.id.toString()}
                                extraData={Folder}
                                refreshing={true}
                            />
                        </SafeAreaView>
                        <View style={ModalStyle.List}>
                            <Feather name="list" size={30} color="#000" />
                            <Text style={[ModalStyle.TextList, { marginHorizontal: 20 }]}>
                                Choose Playlists
                            </Text>
                        </View>
                        <SafeAreaView style={ModalStyle.ListView}>
                            <FlatList
                                data={Folder}
                                ListHeaderComponent={
                                    () => <Text style={{
                                        marginHorizontal: 4,
                                        fontSize: 16
                                    }}>List Playlist</Text>
                                }
                                renderItem={this.renderItem}
                                extraData={Folder}
                                keyExtractor={item => item.id.toString()}
                            />
                        </SafeAreaView>
                    </View>
                </View>
            </Modal>
        )
    }
}
// #23A730