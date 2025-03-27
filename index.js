import { lintRule } from "unified-lint-rule";
import { visit } from "unist-util-visit";
import { generated } from "unist-util-generated";
import { load } from "js-yaml";

function validateFrontmatter(ast, file, options = {}) {
  const defaultOptions = { allowMissingFrontmatter: false };
  options = { ...defaultOptions, ...options };

  let hasYaml = false;

  visit(ast, "yaml", function visitor(node) {
    hasYaml = true;
    if (generated(node)) return;
    try {
      const frontmatter = load(node.value);
      Object.keys(options).forEach((label) => {
        const rules = options[label];
        const value = frontmatter[label];
        if (rules.required) isRequired(file, label, value);
        checkRules(file, rules, label, value, rules.required);
      });
    } catch (err) {
      file.message(`Error parsing YAML frontmatter: ${err.message}`, node);
    }
  });

  if (!hasYaml && !options.allowMissingFrontmatter) {
    file.message("The file does not contain YAML frontmatter.");
  }
}

export default lintRule(
  "remark-lint:frontmatter-validator",
  validateFrontmatter
);

export const checkRules = (file, rules, label, value, required) => {
  // if not required and it does not have a value, skip it.
  if (!required && !value) return;

  if (rules.maxLength) {
    isMaxLength(file, label, value, rules.maxLength);
  }
  if (rules.type) {
    isType(file, label, value, rules.type);
  }
  if (rules.match) {
    isMatch(file, label, value, rules.match);
  }
  if (rules.oneOf) {
    const values = Array.isArray(value) ? value : [value];
    values.forEach((val) => isOneOf(file, label, val, rules.oneOf));
  }
};

export const isMatch = (file, label, value, regex) => {
  const compiledRegex = typeof regex === "string" ? new RegExp(regex) : regex;
  if (!compiledRegex.test(value)) {
    file.message(
      `The value of \`${label}\` "${value}" does not match the pattern: "${compiledRegex}"`
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
  if (!options.includes(value))
    file.message(
      `The value of \`${label}\` "${value}" is not a valid option. Choose from: ${options.join(
        ", "
      )}`
    );
};

export const isRequired = (file, label, field) => {
  if (field === undefined) file.message(`The field \`${label}\` is required`);
};

const typeCheckers = {
  string: (value) => typeof value === "string",
  object: (value) => typeof value === "object" && value !== null,
  number: (value) => typeof value === "number",
  boolean: (value) => typeof value === "boolean",
  array: (value) => Array.isArray(value),
  date: (value) => value instanceof Date,
};

export const isType = (file, label, value, type) => {
  const checkFunction = typeCheckers[type];
  if (checkFunction) {
    if (!checkFunction(value)) {
      file.message(
        `The value of \`${label}\` must be "${type}", it is currently "${typeof value}"`
      );
    }
  } else {
    file.message(`The type "${type}" is invalid.`);
  }
};
