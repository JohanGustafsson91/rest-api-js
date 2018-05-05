import { parse } from "url";
import { hash } from "bcrypt-nodejs";
import {
  partial,
  assignObject,
  getBodyDataFromRequest
} from "../utils/functions";
import api, { sendResponse } from "../utils/router";
import userModel from "../models/user";
import { validateInput } from "../models";
import { insertToDb, getFromDb } from "../utils/database";
import { DB, SALT } from "../utils/config";

const validUsername = ({ users }) => users.length === 0;
const userExistMessage = (obj, key) => ({ errors: [`${key} already exists.`] });

const filter = (key, username) => item =>
  item[key].toLowerCase().indexOf(username.toLowerCase()) !== -1;

const removeSensitiveData = data => ({
  users: data.users.map(({ username, email }) => ({ username, email }))
});

export const getUser = (key, condition, errorMessage, obj) =>
  new Promise((res, rej) =>
    getFromDb(DB.users, DB.users, ({ username }) => username === obj[key])
      .then(data => (condition(data) ? res(obj) : rej(errorMessage(obj, key))))
      .catch(rej)
  );

const handleHash = (res, rej, user, err, hash) =>
  err
    ? rej({ errors: ["Could not add user"] })
    : res(assignObject(user, { password: hash }));

const hashPassword = user =>
  new Promise((res, rej) =>
    hash(user.password, SALT, null, partial(handleHash, [res, rej, user]))
  );

api.PUT("/api/user", (request, response) =>
  getBodyDataFromRequest(request)
    .then(partial(validateInput, [userModel]))
    .then(partial(getUser, ["username", validUsername, userExistMessage]))
    .then(hashPassword)
    .then(partial(insertToDb, [DB.users, false]))
    .then(partial(sendResponse, [200, response, { message: "User added!" }]))
    .catch(partial(sendResponse, [400, response]))
);

api.GET("/api/user?q=:query", ({ url }, response) =>
  getFromDb(DB.users, DB.users, filter("username", parse(url, true).query.q))
    .then(removeSensitiveData)
    .then(partial(sendResponse, [200, response]))
    .catch(partial(sendResponse, [400, response]))
);
