import { METHODS } from "./config";
import { pipe, partial, initMap, routeToRegex, parseJSON } from "./functions";

export const apiRoutes = initMap(METHODS);

export const sendResponse = (statusCode, response, data) => {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  return response.end(JSON.stringify(data));
};

const respondWith404 = (request, response) =>
  sendResponse(404, response, { message: "Endpoint not found" });

const processRequest = (request, response, [handler = respondWith404]) =>
  handler(request, response);

const getHandlerForRequest = (routes, endPoint) =>
  routes
    .filter(({ match, handler }) => match.test(endPoint))
    .map(({ handler }) => handler);

export const handleRequest = (request, response) =>
  pipe(getHandlerForRequest, partial(processRequest, [request, response]))(
    apiRoutes.get(request.method) || [],
    request.url
  );

const registerRoute = (routes, method, route, handler) =>
  routes.set(method, [
    ...routes.get(method),
    {
      route,
      handler,
      match: routeToRegex(route, /:[a-zA-Z]*/gm, "[a-zA-Z]*")
    }
  ]);

export default {
  GET: partial(registerRoute, [apiRoutes, "GET"]),
  PUT: partial(registerRoute, [apiRoutes, "PUT"])
};
