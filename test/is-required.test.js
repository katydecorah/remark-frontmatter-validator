"use strict";

const remark = require("remark");
const plugin = require("../index.js");
const frontmatter = require("remark-frontmatter");
const vfile = require("to-vfile");
const test = require("tape");

test("isRequired", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      title: {
        type: "string",
        required: true,
      },
      img: {
        type: "string",
        required: true,
      },
    })
    .process(vfile.readSync("./test/examples/works.md"), (err, data) => {
      t.equal(data.messages.length, 2);
      t.equal(data.messages[0].message, "The field `img` is required");
      t.equal(
        data.messages[1].message,
        'The value of `img` must be "string", it is currently "undefined"'
      );
      t.end();
    });
});
