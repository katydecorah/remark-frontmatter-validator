"use strict";

const remark = require("remark");
const plugin = require("../index.js");
const frontmatter = require("remark-frontmatter");
const vfile = require("to-vfile");
const test = require("tape");

test("isMaxLength", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      tags: {
        maxLength: "1",
        required: true,
      },
      id: {
        maxLength: "2",
        required: true,
      },
    })
    .process(vfile.readSync("./test/examples/length.md"), (err, data) => {
      t.equal(data.messages.length, 2);
      t.equal(
        data.messages[0].message,
        'The value of `tags` has a maximum length of 1, the value you entered "writing,code,JavaScript" has a length of 3'
      );
      t.equal(
        data.messages[1].message,
        'The value of `id` has a maximum length of 2, the value you entered "abcd" has a length of 4'
      );
      t.end();
    });
});
