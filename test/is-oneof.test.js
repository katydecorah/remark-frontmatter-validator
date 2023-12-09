"use strict";

const remark = require("remark");
const plugin = require("../index.js");
const frontmatter = require("remark-frontmatter");
const vfile = require("to-vfile");

test("oneOf", () => {
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
      expect(data.messages.length).toBe(1);
      expect(data.messages).toMatchInlineSnapshot(`
        [
          [./test/examples/works.md:1:1: The value of \`tags\` "CSS" is not a valid option. Choose from: cool, beans],
        ]
      `);
    });
});

test("oneOf string", () => {
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
        expect(data.messages.length).toBe(0);
      }
    );
});
