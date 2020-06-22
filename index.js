"use strict";

const rule = require("unified-lint-rule");
const visit = require("unist-util-visit");
const generated = require("unist-util-generated");
const jsyaml = require("js-yaml");

function yaml(ast, file, options) {
  visit(ast, "yaml", visitor);
  function visitor(node) {
    function checkRules(rules, label, value, required) {
      // if not required and it does not have a value, skip it.
      if (!required && !value) return;
      if (rules && rules.maxLength) {
        isMaxLength(label, value, rules.maxLength);
      }
      if (rules && rules.type) {
        isType(label, value, rules.type);
      }
      if (rules && rules.match) {
        isMatch(label, value, rules.match);
      }
      if (rules && rules.oneOf) {
        value.forEach((val) => isOneOf(label, val, rules.oneOf));
      }
    }

    const isMatch = (label, value, regex) => {
      regex = new RegExp(regex);
      if (!value.match(regex)) {
        file.message(
          `The value of \`${label}\` "${value}" does not match the pattern: "${regex}"`
        );
      }
    };

    const isMaxLength = (label, value, maxLength) => {
      if (value.length > maxLength)
        file.message(
          `The value of \`${label}\` has a maximum length of ${maxLength}, the value you entered "${value}" has a length of ${value.length}`
        );
    };

    const isOneOf = (label, value, options) => {
      if (options.indexOf(value) === -1)
        file.message(
          `The value of \`${label}\` "${value}" is not a valid option. Choose from: ${options.join(
            ", "
          )}`
        );
    };

    const hasField = (label, field) => {
      if (!field) file.message(`Missing \`${label}\` in frontmatter`);
    };
    const isType = (label, value, type) => {
      if (typeof value !== type)
        file.message(
          `The value of \`${label}\` must be "${type}", it is currently "${typeof value}"`
        );
    };

    if (!generated(node)) {
      try {
        // yaml is valid
        jsyaml.safeLoad(node.value);
        const items = jsyaml.safeLoad(node.value);
        Object.keys(options).forEach((label) => {
          const rules = options[label];
          const value = items[label];
          if (rules.required) hasField(label, value);
          checkRules(rules, label, value, rules.required);
        });
      } catch (err) {
        file.message(err, node);
      }
    }
  }
}

module.exports = rule("remark-lint:frontmatter-validator", yaml);
