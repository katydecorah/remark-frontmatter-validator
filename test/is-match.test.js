"use strict";

const remark = require("remark");
const plugin = require("../index.js");
const frontmatter = require("remark-frontmatter");
const vfile = require("to-vfile");
const test = require("tape");

test("isMatch", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      image: {
        match: ".*.(jpg|png|gif)$",
      },
    })
    .process(vfile.readSync("./test/examples/regex.md"), (err, data) => {
      t.equal(data.messages.length, 0);
      t.end();
    });
});

test("isMatch, not ok", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      image: {
        match: ".*.(jpg|png)$",
      },
    })
    .process(vfile.readSync("./test/examples/regex.md"), (err, data) => {
      t.equal(data.messages.length, 1);
      t.equal(
        data.messages[0].message,
        'The value of `image` "cat.gif" does not match the pattern: "/.*.(jpg|png)$/"'
      );

      t.end();
    });
});
