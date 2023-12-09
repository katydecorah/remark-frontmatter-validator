import { isType } from "./is-type.js";
import { isMatch } from "./is-match.js";
import { isMaxLength } from "./is-maxlength.js";
import { isOneOf } from "./is-oneof.js";

export const checkRules = (file, rules, label, value, required) => {
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
