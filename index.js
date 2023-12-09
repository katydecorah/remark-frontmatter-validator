import { lintRule } from "unified-lint-rule";
import { visit } from "unist-util-visit";
import { generated } from "unist-util-generated";
import { load } from "js-yaml";

function yaml(ast, file, options) {
  visit(ast, "yaml", visitor);
  function visitor(node) {
    if (!generated(node)) {
      try {
        // yaml is valid
        load(node.value);
        const frontmatter = load(node.value);
        Object.keys(options).forEach((label) => {
          const rules = options[label];
          const value = frontmatter[label];
          if (rules.required) isRequired(file, label, value);
          checkRules(file, rules, label, value, rules.required);
        });
      } catch (err) {
        file.message(err, node);
      }
    }
  }
}

export default lintRule("remark-lint:frontmatter-validator", yaml);

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

export const isMatch = (file, label, value, regex) => {
  regex = new RegExp(regex);
  if (!value.match(regex)) {
    file.message(
      `The value of \`${label}\` "${value}" does not match the pattern: "${regex}"`
    );
  }
};

export const isMaxLength = (file, label, value, maxLength) => {
  if (value.length > maxLength)
    file.message(
      `The value of \`${label}\` has a maximum length of ${maxLength}, the value you entered "${value}" has a length of ${value.length}`
    );
};

export const isOneOf = (file, label, value, options) => {
  if (options.indexOf(value) === -1)
    file.message(
      `The value of \`${label}\` "${value}" is not a valid option. Choose from: ${options.join(
        ", "
      )}`
    );
};

export const isRequired = (file, label, field) => {
  if (!field) file.message(`The field \`${label}\` is required`);
};

export const isType = (file, label, value, type) => {
  switch (type) {
    case "string":
      if (!isTypeString(value)) createMessage(file, label, type, value);
      break;
    case "object":
      if (!isTypeObject(value)) createMessage(file, label, type, value);
      break;
    case "number":
      if (!isTypeNumber(value)) createMessage(file, label, type, value);
      break;
    case "boolean":
      if (!isTypeBoolean(value)) createMessage(file, label, type, value);
      break;
    case "array":
      if (!isTypeArray(value)) createMessage(file, label, type, value);
      break;
    case "date":
      if (!isTypeDate(value)) createMessage(file, label, type, value);
      break;
    default:
      file.message(`The type "${type}" is invalid.`);
  }
};

const createMessage = (file, label, type, value) =>
  file.message(
    `The value of \`${label}\` must be "${type}", it is currently "${typeof value}"`
  );

const isTypeString = (value) => typeof value === "string";
const isTypeObject = (value) => typeof value === "object";
const isTypeNumber = (value) => typeof value === "number";
const isTypeBoolean = (value) => typeof value === "boolean";
const isTypeArray = (value) => Array.isArray(value);
const isTypeDate = (value) => value instanceof Date;
