import { lintRule } from "unified-lint-rule";
import { visit } from "unist-util-visit";
import { generated } from "unist-util-generated";
import { load } from "js-yaml";
import { checkRules } from "./lib/rules.js";
import { isRequired } from "./lib/is-required.js";

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
