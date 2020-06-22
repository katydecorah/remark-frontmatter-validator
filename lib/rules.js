const checkRules = (file, rules, label, value, required) => {
  // if not required and it does not have a value, skip it.
  if (!required && !value) return;
  if (rules && rules.maxLength) {
    isMaxLength(file, label, value, rules.maxLength);
  }
  if (rules && rules.type) {
    isType(file, label, value, rules.type);
  }
  if (rules && rules.match) {
    isMatch(file, label, value, rules.match);
  }
  if (rules && rules.oneOf) {
    value.forEach((val) => isOneOf(file, label, val, rules.oneOf));
  }
};

const isMatch = (file, label, value, regex) => {
  regex = new RegExp(regex);
  if (!value.match(regex)) {
    file.message(
      `The value of \`${label}\` "${value}" does not match the pattern: "${regex}"`
    );
  }
};

const isMaxLength = (file, label, value, maxLength) => {
  if (value.length > maxLength)
    file.message(
      `The value of \`${label}\` has a maximum length of ${maxLength}, the value you entered "${value}" has a length of ${value.length}`
    );
};

const isOneOf = (file, label, value, options) => {
  if (options.indexOf(value) === -1)
    file.message(
      `The value of \`${label}\` "${value}" is not a valid option. Choose from: ${options.join(
        ", "
      )}`
    );
};

const hasField = (file, label, field) => {
  if (!field) file.message(`Missing \`${label}\` in frontmatter`);
};

const isType = (file, label, value, type) => {
  if (typeof value !== type)
    file.message(
      `The value of \`${label}\` must be "${type}", it is currently "${typeof value}"`
    );
};

module.exports = {
  checkRules,
  hasField,
};
