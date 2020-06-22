const { isType } = require("./is-type");
const { isMatch } = require("./is-match");
const { isMaxLength } = require("./is-maxlength");
const { isOneOf } = require("./is-oneof");
const { isRequired } = require("./is-required");

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
    if (value && typeof value === "string") value = [value];
    value.forEach((val) => isOneOf(file, label, val, rules.oneOf));
  }
};

module.exports = {
  checkRules,
  isRequired,
};
