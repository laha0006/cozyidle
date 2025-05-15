import db from "../connection.js";
import fs from "fs";
import path from "path";

async function executeSqlFile(filePath) {
    const sql = fs.readFileSync(path.resolve(filePath), "utf8");
    await db.query(sql);
    await db.end();
    console.log("succesfully ran sql script");
}

executeSqlFile("./database/schema/schema.sql");
