export const errorMessage = (field, info) =>
  `Must provide a valid ${field}${info ? ` (${info})` : ""}`;

export const validateInput = (model, input) =>
  new Promise((res, rej) => {
    const errors = Object.keys(model)
      .filter(key => !model[key].validate.test(input[key]))
      .map(error => model[error].error);

    return errors.length === 0 ? res(input) : rej({ errors });
  });
