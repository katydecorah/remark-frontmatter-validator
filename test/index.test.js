"use strict";

const remark = require("remark");
const plugin = require("../index.js");
const frontmatter = require("remark-frontmatter");
const vfile = require("to-vfile");
const test = require("tape");

test("required", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      required: {
        title: {
          type: "string",
        },
        img: {
          type: "string",
        },
      },
    })
    .process(vfile.readSync("./test/examples/works.md"), (err, data) => {
      t.equal(data.messages.length, 2);
      t.equal(data.messages[0].message, "Missing `img` in frontmatter");
      t.equal(
        data.messages[1].message,
        '`img` must be a "string", it is currently a undefined'
      );
      t.end();
    });
});

test("regex, ok", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      optional: {
        image: {
          match: ".*.(jpg|png|gif)$",
        },
      },
    })
    .process(vfile.readSync("./test/examples/regex.md"), (err, data) => {
      t.equal(data.messages.length, 0);
      t.end();
    });
});

test("regex, not ok", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      optional: {
        image: {
          match: ".*.(jpg|png)$",
        },
      },
    })
    .process(vfile.readSync("./test/examples/regex.md"), (err, data) => {
      t.equal(data.messages.length, 1);
      t.equal(
        data.messages[0].message,
        '`image` value "cat.gif" does not match /.*.(jpg|png)$/'
      );

      t.end();
    });
});
