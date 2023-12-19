import express from "express";
import mysql, { Connection, MysqlError } from "mysql";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
const mysqluser = process.env.DBUSER || "simpletory";
const mysqlhost = process.env.DBHOST || "localhost";
const mysqlpw = process.env.DBPASSWORD || "default";
const mysqldb = process.env.DB || "simpletory";

const con: Connection = mysql.createConnection({
    database: mysqldb,
    host: mysqlhost,
    user: mysqluser,
    password: mysqlpw
})

app.use(express.static(path.resolve(__dirname, "../")));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);

    let inventory_item = {
        item_id: "INTEGER",
        name: "VARCHAR(100)",
        PRIMARY_KEY: "item_id"
    }

    connectToDatabase(con);
    createTableIfNotExistent("inventory_item");
    console.log(loadVersion());
    getKeysAndValuesOfObject(inventory_item);
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/additem.html");
})

app.get("/node_modules", (req, res) => {
    console.log(req);
})

function connectToDatabase(connection: Connection) {
    connection.connect();
}

function loadVersion() {
    return JSON.parse(fs.readFileSync("package.json", "utf-8")).version;
}

function createTableIfNotExistent(tablename: String) {
    let query = `CREATE TABLE IF NOT EXISTS ${tablename} (item_id INTEGER, name VARCHAR(100), PRIMARY KEY (item_id));`;

    con.query(query, (err) => {
        if (err)
            console.log(err);
    });
}

function getKeysAndValuesOfObject(obj: any) {
    let keys = Object.keys(obj);
    let query = `CREATE TABLE IF NOT EXISTS test (`;
    console.log(keys);

    for (let index = 0; index < keys.length; index++) {
        if (keys[index + 1] == undefined && keys[index] != "PRIMARY_KEY") {
            query += keys[index] + " " + obj[`${keys[index]}`] + "); ";
        }
        else if (keys[index + 1] == undefined && keys[index] == "PRIMARY_KEY")
            query += "PRIMARY KEY (" + obj[`${keys[index]}`] + ")); ";
        else
            query += keys[index] + " " + obj[`${keys[index]}`] + ", ";

    }

    console.log(query);
}

