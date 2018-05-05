const identity = x => x;
export const pipe = (...funcs) =>
  funcs.reduce((acc, curr) => x => curr(acc(x)), identity);

export const curry2 = uncurried => {
  let args = Array.prototype.slice.call(arguments, 1);
  return function() {
    return uncurried.apply(
      this,
      args.concat(Array.prototype.slice.call(arguments, 0))
    );
  };
};

export function curry(fn) {
  function nest(N, args) {
    console.log(N, args)
    return (...xs) => {
      console.log(xs)
      if (N - xs.length <= 0) {
        return fn(...args, ...xs);
      }
      return nest(N - xs.length, [...args, ...xs]);
    };
  }
  return nest(fn.length, []);
}
