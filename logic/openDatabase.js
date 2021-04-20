import * as SQLite from 'expo-sqlite';

let db;
async function Open() {
    try {
        const _db = SQLite.openDatabase('musicapp');
        return _db
    } catch (error) {
        return error;
    }
}

async function getDb() {
    try {
        if (db === null) {
            db = await Open();
            return db;
        }
        return db
    } catch (error) {
        return error
    }
}

export { getDb, SQLite }