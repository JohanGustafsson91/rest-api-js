export const PORT = 8080;

export const METHODS = {
  GET: [],
  PUT: []
};

export const REGEX = {
  username: /^[a-zA-Z0-9_-]{3,}$/,
  email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
  message: /^.{1,}$/
};

export const DB = {
  users: "users",
  messages: "messages"
};

export const SALT = "$2a$04$T/8s.3kcYRc5l4kzV/pAs."; // NOTE: bp example
