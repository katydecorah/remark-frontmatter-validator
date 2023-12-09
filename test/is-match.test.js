"use strict";

const remark = require("remark");
const plugin = require("../index.js");
const frontmatter = require("remark-frontmatter");
const vfile = require("to-vfile");

test("isMatch", () => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      image: {
        match: ".*.(jpg|png|gif)$",
      },
    })
    .process(vfile.readSync("./test/examples/regex.md"), (err, data) => {
      expect(data.messages.length).toBe(0);
    });
});

test("isMatch, not ok", () => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      image: {
        match: ".*.(jpg|png)$",
      },
    })
    .process(vfile.readSync("./test/examples/regex.md"), (err, data) => {
      expect(data.messages.length).toBe(1);
      expect(data.messages[0].message).toMatchInlineSnapshot(
        `"The value of \`image\` "cat.gif" does not match the pattern: "/.*.(jpg|png)$/""`
      );
    });
});
