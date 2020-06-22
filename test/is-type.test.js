"use strict";

const remark = require("remark");
const plugin = require("../index.js");
const frontmatter = require("remark-frontmatter");
const vfile = require("to-vfile");
const test = require("tape");

test("isType, not ok", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      tags: {
        maxLength: "4",
        type: "string",
        required: true,
      },
    })
    .process(vfile.readSync("./test/examples/works.md"), (err, data) => {
      t.equal(data.messages.length, 1);
      t.equal(
        data.messages[0].message,
        'The value of `tags` must be "string", it is currently "object"'
      );
      t.end();
    });
});

test("isType, array", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      tags: {
        maxLength: "4",
        type: "array",
        required: true,
      },
    })
    .process(vfile.readSync("./test/examples/works.md"), (err, data) => {
      t.equal(data.messages.length, 0);
      t.end();
    });
});

test("isType, string", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      title: {
        type: "string",
        required: true,
      },
    })
    .process(vfile.readSync("./test/examples/works.md"), (err, data) => {
      t.equal(data.messages.length, 0);
      t.end();
    });
});

test("isType, number", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      order: {
        type: "number",
        required: true,
      },
    })
    .process(vfile.readSync("./test/examples/works.md"), (err, data) => {
      t.equal(data.messages.length, 0);
      t.end();
    });
});

test("isType, boolean", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      offline: {
        type: "boolean",
        required: true,
      },
    })
    .process(vfile.readSync("./test/examples/works.md"), (err, data) => {
      t.equal(data.messages.length, 0);
      t.end();
    });
});

test("isType, date", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      date: {
        required: true,
        type: "date",
      },
    })
    .process(vfile.readSync("./test/examples/date-match.md"), (err, data) => {
      t.equal(data.messages.length, 0);
      t.end();
    });
});

test("isType, object", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      authors: {
        required: true,
        type: "object",
      },
    })
    .process(vfile.readSync("./test/examples/works.md"), (err, data) => {
      t.equal(data.messages.length, 0);
      t.end();
    });
});
