"use strict";

const remark = require("remark");
const plugin = require("../index.js");
const frontmatter = require("remark-frontmatter");
const vfile = require("to-vfile");

test("isType, not ok", () => {
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
      expect(data.messages.length).toBe(1);
      expect(data.messages).toMatchInlineSnapshot(`
        [
          [./test/examples/works.md:1:1: The value of \`tags\` must be "string", it is currently "object"],
        ]
      `);
    });
});

test("isType, array", () => {
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
      expect(data.messages.length).toBe(0);
    });
});

test("isType, string", () => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      title: {
        type: "string",
        required: true,
      },
    })
    .process(vfile.readSync("./test/examples/works.md"), (err, data) => {
      expect(data.messages.length).toBe(0);
    });
});

test("isType, number", () => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      order: {
        type: "number",
        required: true,
      },
    })
    .process(vfile.readSync("./test/examples/works.md"), (err, data) => {
      expect(data.messages.length).toBe(0);
    });
});

test("isType, boolean", () => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      offline: {
        type: "boolean",
        required: true,
      },
    })
    .process(vfile.readSync("./test/examples/works.md"), (err, data) => {
      expect(data.messages.length).toBe(0);
    });
});

test("isType, date", () => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      date: {
        required: true,
        type: "date",
      },
    })
    .process(vfile.readSync("./test/examples/works.md"), (err, data) => {
      expect(data.messages.length).toBe(0);
    });
});

test("isType, object", () => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      authors: {
        required: true,
        type: "object",
      },
    })
    .process(vfile.readSync("./test/examples/works.md"), (err, data) => {
      expect(data.messages.length).toBe(0);
    });
});
