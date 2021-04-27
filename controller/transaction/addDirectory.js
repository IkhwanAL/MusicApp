import { SQLError } from 'expo-sqlite';
import { Alert } from 'react-native';
import { getDb, SQLite } from '../openDatabase';

const db = SQLite.openDatabase('musicapp.db');

function CreateTableFolderLocation() {
    // const SQLQuery = "CREATE TABLE IF NOT EXISTS folderLocation(id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT NOT NULL)";
    db.transaction(tx => {
        tx.executeSql("create table if not exists folder (id integer primary key autoincrement, directory text not null, path text not null)")
    }, (er) => { console.log("Failed", er.message) })
}

function CreateTablePlaylistMusic() {
    const SQLQuery = "CREATE TABLE IF NOT EXISTS playlist(id INTEGER PRIMARY KEY AUTOINCREMENT, fileName TEXT NOT NULL)";
    db.transaction(trx => {
        trx.executeSql(SQLQuery);
    })
}

function DropTable() {
    db.transaction(tx => {
        tx.executeSql("DROP TABLE IF EXISTS folder")
    }, (er) => { console.log('Failed', er) }, () => { console.log("Drop") })
}

async function insertFolder(directory, uriFile) {
    // const SQLQuery = "INSERT INTO folderLocation (uri) VALUES(?)";
    db.transaction(tx => {
        tx.executeSql("insert into folder ( directory, path ) values ( ?, ? )", [directory, uriFile])
    }, (er) => { console.log('Failed', er.message) });
}

export { CreateTableFolderLocation, insertFolder, db, DropTable };