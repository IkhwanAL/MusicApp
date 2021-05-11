import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('musicapp.db');

function CreateTableFolderLocation() {
    db.transaction(tx => {
        tx.executeSql("create table if not exists folder (id integer primary key autoincrement, directory text not null, path text not null)")
    }, (er) => { console.log("Failed", er.message) })
}

function CreateTablePlaylistMusic() {
    const SQLQuery = "CREATE TABLE IF NOT EXISTS playlist (playlistID INTEGER PRIMARY KEY AUTOINCREMENT, playlistName text not null)";
    db.transaction(trx => {
        trx.executeSql(SQLQuery, []);
    }, (er) => console.error(er), () => console.log("Success Playlist Table"));
}

function createRelationFileWithPlaylist() {
    const SQLQuery = `create table if not exists playlistMusic 
        (
            id integer primary key autoincrement,
            playlistID INTEGER NOT NULL,
            file text not null,
            FOREIGN KEY (playlistID)
                REFERENCES playlist (playlistID)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE
        )`;
    db.transaction(trx => {
        trx.executeSql(SQLQuery);
    }, (er) => console.error(er), () => console.log("Success"))
}

function DropTablePlaylist() {
    db.transaction(trx => {
        trx.executeSql("DROP TABLE IF EXISTS playlistMusic");
        trx.executeSql("DROP TABLE IF EXISTS playlist");
    }, (er) => console.error(er), () => console.log("Success Playlist Relation"));
}

function DropTable() {
    db.transaction(tx => {
        tx.executeSql("DROP TABLE IF EXISTS folder")
    }, (er) => { console.log('Failed', er) }, () => { console.log("Drop") })
}

function insertPlaylist(playlistName = null, file = null) {
    db.transaction(trx => {
        if (playlistName !== null) {
            trx.executeSql("");
        }
        if (file !== null) {
            trx.executeSql("");
        }
    })
}

async function insertFolder(directory, uriFile) {
    db.transaction(tx => {
        tx.executeSql("insert into folder ( directory, path ) values ( ?, ? )", [directory, uriFile])
    }, (er) => { console.log('Failed', er.message) });
}

export {
    db,
    CreateTableFolderLocation,
    insertFolder,
    DropTable,
    CreateTablePlaylistMusic,
    createRelationFileWithPlaylist,
    DropTablePlaylist,
    insertPlaylist
};