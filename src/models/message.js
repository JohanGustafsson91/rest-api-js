import { errorMessage } from "./";
import { REGEX } from "../utils/config";

export default {
  message: {
    validate: REGEX.message,
    error: errorMessage("message", "At least one letter")
  },
  sender: {
    validate: REGEX.username,
    error: errorMessage("sender")
  },
  receiver: {
    validate: REGEX.username,
    error: errorMessage("receiver")
  }
};
