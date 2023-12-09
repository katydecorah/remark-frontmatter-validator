"use strict";

const remark = require("remark");
const plugin = require("../index.js");
const frontmatter = require("remark-frontmatter");
const vfile = require("to-vfile");

test("isMaxLength", () => {
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
      expect(data.messages.length).toBe(2);
      expect(data.messages).toMatchInlineSnapshot(`
        [
          [./test/examples/length.md:1:1: The value of \`tags\` has a maximum length of 1, the value you entered "writing,code,JavaScript" has a length of 3],
          [./test/examples/length.md:1:1: The value of \`id\` has a maximum length of 2, the value you entered "abcd" has a length of 4],
        ]
      `);
    });
});
