"use strict";

const remark = require("remark");
const plugin = require("../index.js");
const frontmatter = require("remark-frontmatter");
const vfile = require("to-vfile");

test("isRequired", () => {
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
      expect(data.messages.length).toBe(2);
      expect(data.messages).toMatchInlineSnapshot(`
        [
          [./test/examples/works.md:1:1: The field \`img\` is required],
          [./test/examples/works.md:1:1: The value of \`img\` must be "string", it is currently "undefined"],
        ]
      `);
    });
});
