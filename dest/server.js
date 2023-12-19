"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mysql_1 = __importDefault(require("mysql"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT || 3000;
const mysqluser = process.env.DBUSER || "simpletory";
const mysqlhost = process.env.DBHOST || "localhost";
const mysqlpw = process.env.DBPASSWORD || "default";
const mysqldb = process.env.DB || "simpletory";
const con = mysql_1.default.createConnection({
    database: mysqldb,
    host: mysqlhost,
    user: mysqluser,
    password: mysqlpw
});
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../")));
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    let inventory_item = {
        item_id: "INTEGER",
        name: "VARCHAR(100)",
        PRIMARY_KEY: "item_id"
    };
    connectToDatabase(con);
    createTableIfNotExistent("inventory_item");
    console.log(loadVersion());
    getKeysAndValuesOfObject(inventory_item);
});
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/additem.html");
});
app.get("/node_modules", (req, res) => {
    console.log(req);
});
function connectToDatabase(connection) {
    connection.connect();
}
function loadVersion() {
    return JSON.parse(fs_1.default.readFileSync("package.json", "utf-8")).version;
}
function createTableIfNotExistent(tablename) {
    let query = `CREATE TABLE IF NOT EXISTS ${tablename} (item_id INTEGER, name VARCHAR(100), PRIMARY KEY (item_id));`;
    con.query(query, (err) => {
        if (err)
            console.log(err);
    });
}
function getKeysAndValuesOfObject(obj) {
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
//# sourceMappingURL=server.js.map