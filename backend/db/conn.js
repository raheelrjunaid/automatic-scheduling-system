import { MongoClient } from "mongodb"
const uri = process.env.ATLAS_URI
const client = new MongoClient(uri)

let dbConnection
export function connectToServer(callback) {
    client.connect(function (err, db) {
        if (err || !db) {
            return callback(err)
        }

        dbConnection = db.db("main")
        console.log("Successfully connected to MongoDB.")

        return callback()
    });
}

export function getDB() {
    return dbConnection
}
