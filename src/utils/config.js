function curry(uncurried) {
  let args = Array.prototype.slice.call(arguments, 1);
  return function() {
    return uncurried.apply(
      this,
      args.concat(Array.prototype.slice.call(arguments, 0))
    );
  };
}

import { pipe } from "./helpers";

const initRouteValues = {
  get: [],
  post: [],
  put: []
};

const initMap = initMapValues =>
  Object.keys(initMapValues).reduce(
    (map, key) => map.set(key, initMapValues[key]),
    new Map()
  );

export const apiRoutes = pipe(initMap)(initRouteValues);

const registerRoute = (routes, method, route, handler) => {
  // TODO add regex match
  return routes.set(method, [...routes.get(method), { route, handler }]);
};

const app = {
  get: curry(registerRoute, apiRoutes, "get"),
  post: curry(registerRoute, apiRoutes, "post")
};

export function handleRequest(request, response) {
  console.log(request.method, request.url);
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ working: "yes" }));
}


export default app;
