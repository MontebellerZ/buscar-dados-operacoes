import path from "path";
import fs from "fs";

function readSql(filename: string) {
  const filepath = path.resolve(__dirname, "sql", filename);
  return fs.readFileSync(filepath, "utf-8");
}

export default readSql;
