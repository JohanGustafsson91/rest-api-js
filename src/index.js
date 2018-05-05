import "./controllers/user";
import "./controllers/message";
import { handleRequest } from "./utils/router";
import { PORT } from "./utils/config";
import { createServer } from "http";

createServer(handleRequest).listen(PORT);
console.log(`\nServer listening at port ${PORT}`);
