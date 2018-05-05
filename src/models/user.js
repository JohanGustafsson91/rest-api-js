import { errorMessage } from "./";
import { REGEX } from "../utils/config";

export default {
  username: {
    validate: REGEX.username,
    error: errorMessage("username", "min 3 chars of letters, numbers, _, -")
  },
  email: {
    validate: REGEX.email,
    error: errorMessage("email")
  },
  password: {
    validate: REGEX.password,
    error: errorMessage("password", "8 chars with one upper, lower and digit")
  }
};
