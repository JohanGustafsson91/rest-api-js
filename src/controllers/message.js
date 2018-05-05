import { partial, getBodyDataFromRequest } from "../utils/functions";
import api, { sendResponse } from "../utils/router";
import messageModel from "../models/message";
import { validateInput } from "../models";
import { getUser } from "../controllers/user";
import { getFromDb, insertToDb } from "../utils/database";
import { DB } from "../utils/config";

const userExists = ({ users }) => users.length > 0;

const filterMessages = (key, req) => message =>
  message[key] === req.url.split("/")[3];

const noUserMessage = (obj, key) => ({ errors: [`Enter a valid ${key}`] });

api.PUT("/api/message", (request, response) =>
  getBodyDataFromRequest(request)
    .then(partial(validateInput, [messageModel]))
    .then(partial(getUser, ["sender", userExists, noUserMessage]))
    .then(partial(getUser, ["receiver", userExists, noUserMessage]))
    .then(partial(insertToDb, [DB.messages, new Date()]))
    .then(partial(sendResponse, [200, response, { message: "Message sent" }]))
    .catch(partial(sendResponse, [400, response]))
);

api.GET("/api/message/:userId/sent", (request, response) =>
  getFromDb(DB.messages, DB.messages, filterMessages("sender", request))
    .then(partial(sendResponse, [200, response]))
    .catch(partial(sendResponse, [400, response]))
);

api.GET("/api/message/:userId/received", (request, response) =>
  getFromDb(DB.messages, DB.messages, filterMessages("receiver", request))
    .then(partial(sendResponse, [200, response]))
    .catch(partial(sendResponse, [400, response]))
);
