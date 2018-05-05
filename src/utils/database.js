import { writeFile, readFile } from "fs";
import path from "path";
import { partial, assignObject, parseJSON } from "../utils/functions";

const DB_FILE_PATH = path.join(__dirname, "../../", "db");

const handleFileCallback = (res, rej, err, data) =>
  err
    ? rej({ errors: ["Could not connect to database"] })
    : data
      ? res(parseJSON(data))
      : res();

const openFile = filename =>
  new Promise((res, rej) =>
    readFile(
      `${DB_FILE_PATH}/${filename}.json`,
      "UTF-8",
      partial(handleFileCallback, [res, rej])
    )
  );

const saveFile = (filename, data) =>
  new Promise((res, rej) =>
    writeFile(
      `${DB_FILE_PATH}/${filename}.json`,
      JSON.stringify(data, null, 2),
      partial(handleFileCallback, [res, rej])
    )
  );

const writeToFile = (filename, newData) =>
  openFile(filename)
    .then(obj => assignObject(obj, { data: obj.data.concat(newData) }))
    .then(partial(saveFile, [filename]));

export const getFromDb = (collection, key, condition) =>
  openFile(collection).then((res = { data: [] }) => ({
    [key]: res.data.filter(condition)
  }));

export const insertToDb = (collection, timestamp, data) =>
  writeToFile(
    collection,
    timestamp ? assignObject(data, { created: timestamp }) : data
  );
