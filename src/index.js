import server, { apiRoutes, handleRequest } from "./utils/config";
import users from "./controllers/user";
import { createServer } from "http";

createServer(handleRequest).listen(8080);


console.log("Server running!", apiRoutes);
