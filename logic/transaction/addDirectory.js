import { getDb, SQLite } from '../openDatabase';

async function CreateTableFolderLocation() {
    const SQLQuery = "CREATE TABLE IF NOT EXISTS folderLocation(id INTEGER PRIMARY KEY AUTO INCREMENT, uri TEXT)";
    const db = await getDb();
    db.transaction(tx => {
        tx.execute(SQLQuery)
    })
}

async function CreateTablePlaylistMusic() {
    const SQLQuery = "CREATE TABLE IF NOT EXISTS playlist(id INTEGER PRIMARY KEY AUTO INCREMENT, fileName TEXT)";
    const db = await getDb();
    db.transaction(trx => {
        trx.execute(SQLQuery);
        trx.commit();
    })
}

async function insertFolder() {
    const SQLQuery = "INSERT INTO folderLocation VALUES(?)"
}