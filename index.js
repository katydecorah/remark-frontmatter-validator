"use strict";

const rule = require("unified-lint-rule");
const visit = require("unist-util-visit");
const generated = require("unist-util-generated");
const jsyaml = require("js-yaml");

function yaml(ast, file, options) {
  const { required, optional } = options;
  visit(ast, "yaml", visitor);
  function visitor(node) {
    const hasField = (label, field) => {
      if (!field) file.message(`Missing \`${label}\` in frontmatter`);
    };
    const isType = (label, value, type) => {
      if (typeof value !== type)
        file.message(
          `\`${label}\` must be a "${type}", it is currently a ${typeof value}`
        );
    };

    function checkRules(rules, label, value) {
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
        file.message(`\`${label}\` value "${value}" does not match ${regex}`);
      }
    };

    const isMaxLength = (label, value, maxLength) => {
      if (value.length > maxLength)
        file.message(
          `The maximum length of \`${label}\` value is ${maxLength}, the value you entered "${value}" has a length of ${value.length}`
        );
    };

    const isOneOf = (label, value, options) => {
      if (options.indexOf(value) === -1)
        file.message(
          `The \`${label}\` "${value}" is not a valid option. Choose from: ${options.join(
            ", "
          )}`
        );
    };

    if (!generated(node)) {
      try {
        // yaml is valid
        jsyaml.safeLoad(node.value);
        const items = jsyaml.safeLoad(node.value);

        // assert required field and their type
        if (required) {
          Object.keys(required).forEach((label) => {
            const rules = required[label];
            const value = items[label];
            hasField(label, value);
            checkRules(rules, label, value);
          });
        }

        // assert optional fields
        if (optional) {
          Object.keys(optional).forEach((label) => {
            const rules = optional[label];
            const value = items[label];
            if (value) {
              checkRules(rules, label, value);
            }
          });
        }
      } catch (err) {
        file.message(err, node);
      }
    }
  }
}

module.exports = rule("remark-lint:frontmatter-validator", yaml);
