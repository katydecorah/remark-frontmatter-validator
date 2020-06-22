"use strict";

const remark = require("remark");
const plugin = require("../index.js");
const frontmatter = require("remark-frontmatter");
const vfile = require("to-vfile");
const test = require("tape");

test("oneOf", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      tags: {
        maxLength: "4",
        type: "object",
        required: true,
        oneOf: ["cool", "beans"],
      },
    })
    .process(vfile.readSync("./test/examples/works.md"), (err, data) => {
      t.equal(data.messages.length, 1);
      t.equal(
        data.messages[0].message,
        'The value of `tags` "CSS" is not a valid option. Choose from: cool, beans'
      );
      t.end();
    });
});

test("oneOf string", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      category: {
        type: "string",
        required: true,
        oneOf: ["code"],
      },
    })
    .process(
      vfile.readSync("./test/examples/one-of-string.md"),
      (err, data) => {
        t.equal(data.messages.length, 0);
        t.end();
      }
    );
});
