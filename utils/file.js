import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const { StorageAccessFramework } = FileSystem

const readDirectory = async (getItem) => {
    if (getItem !== null) {
        const res = JSON.parse(getItem);

        let listMusicFile = [];

        try {
            for (const [key, values] of Object.entries(res)) {
                const path = values.path;
                const file = await StorageAccessFramework.readDirectoryAsync(path);
                const pushData = listMusicFile.concat(file);
                listMusicFile = pushData;
            }
        } catch (error) {
            console.log(error.message)
            return
        }
        const extMP3 = listMusicFile.filter(val => {
            if ((typeof val === 'string')) {
                const title = takeTitleFromPath(val);
                return extFileMusic(title);
            }
        })
        return Object.entries(extMP3);
    }
}

const takeTitleFromPath = (path) => {
    const splitPunctuation = decodeURIComponent(path).split(':');
    const takeLastIndex = splitPunctuation[splitPunctuation.length - 1];
    const searchPunc = takeLastIndex.search('/');
    return takeLastIndex.substr(searchPunc + 1, takeLastIndex.length);
}

function extFileMusic(val) {
    if (typeof val === 'string') {
        if (val.toLowerCase().includes('.mp3') ||
            val.toLowerCase().includes('.mp4') ||
            val.toLowerCase().includes('.m4a') ||
            val.toLowerCase().includes('.wav') ||
            val.toLowerCase().includes('.aac') ||
            val.toLowerCase().includes('.wma') ||
            val.toLowerCase().includes('.flac')
        ) {
            return true
        }
    }
    return false
}

const onReturnObject = async (callback) => {
    const fetchItem = await AsyncStorage.getItem('@musicList');
    if (fetchItem === null) {
        callback(null);
        return
    }
    const data = await readDirectory(fetchItem);
    if (data === null) {
        callback(null);
        return
    }
    const convert = Object.fromEntries(data);
    callback(convert);
}

const removeExtName = (path) => {
    if (typeof path === 'string') {
        const data = path.replace(/\.[^/.]+$/, "");
        return data;
    }
}

export {
    readDirectory,
    takeTitleFromPath,
    extFileMusic,
    onReturnObject,
    removeExtName
}