const isOneOf = (file, label, value, options) => {
  if (options.indexOf(value) === -1)
    file.message(
      `The value of \`${label}\` "${value}" is not a valid option. Choose from: ${options.join(
        ", "
      )}`
    );
};

module.exports = {
  isOneOf,
};
