"use strict";

const rule = require("unified-lint-rule");
const visit = require("unist-util-visit");
const generated = require("unist-util-generated");
const jsyaml = require("js-yaml");
const { checkRules, isRequired } = require("./lib/rules.js");

function yaml(ast, file, options) {
  visit(ast, "yaml", visitor);
  function visitor(node) {
    if (!generated(node)) {
      try {
        // yaml is valid
        jsyaml.safeLoad(node.value);
        const frontmatter = jsyaml.safeLoad(node.value);
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

module.exports = rule("remark-lint:frontmatter-validator", yaml);
