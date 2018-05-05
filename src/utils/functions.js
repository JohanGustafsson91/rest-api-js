export const pipe = (...funcs) => (...args) =>
  funcs.reduce((acc, curr, i) => (i === 0 ? curr(...acc) : curr(acc)), args);

export const partial = (fn, args) => (...restOfArgs) =>
  fn(...args.concat(restOfArgs));

export const initMap = initMapValues =>
  Object.keys(initMapValues).reduce(
    (map, key) => map.set(key, initMapValues[key]),
    new Map()
  );

export const routeToRegex = (string, regex, replace) =>
  new RegExp(`^${string.replace(regex, replace).replace(/\?/, "\\?")}(\/)?$`);

export const assignObject = (obj, newVal) => Object.assign({}, obj, newVal);

export const parseJSON = data =>
  new Promise((res, rej) => {
    try {
      return res(JSON.parse(data));
    } catch (e) {
      return rej({ errors: ["Could not parse json data"] });
    }
  });

export const getBodyDataFromRequest = request =>
  new Promise((res, rej) => {
    let body = []; // side-effect
    return request
      .on("data", chunk => body.push(chunk))
      .on("end", () => res(parseJSON(Buffer.concat(body).toString())));
  });
