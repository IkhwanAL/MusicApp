import * as SQLite from 'expo-sqlite';

let db;
function Open() {
    try {
        const _db = SQLite.openDatabase('musicapp');
        return _db
    } catch (error) {
        return error;
    }
}

function getDb() {
    try {
        if (db === null) {
            db = Open();
            return db;
        }
        return db
    } catch (error) {
        return error
    }
}

export { getDb, SQLite }