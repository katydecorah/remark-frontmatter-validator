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

test("isType", (t) => {
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

test("oneOf", (t) => {
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
      t.equal(data.messages.length, 1);
      t.equal(
        data.messages[0].message,
        'The value of `tags` "CSS" is not a valid option. Choose from: cool, beans'
      );
      t.end();
    });
});

test("the works", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      tags: {
        maxLength: 5,
        type: "object",
        oneOf: [
          "CodePen",
          "Sass",
          "Haml",
          "Dribbble",
          "API",
          "Jekyll",
          "Node.js",
          "CSS",
          "animation",
          "writing",
          "AWS",
          "Google Sheets",
          "JavaScript",
          "Ela Conf",
          "jQuery",
          "AngularJS",
          "recipe",
          "Zapier",
          "podcasts",
          "speaking",
          "Glitch",
          "Git",
          "PHP",
          "GitHub",
          "Airtable",
          "Google Docs",
        ],
      },
      pen: {
        type: "string",
        maxLength: "7",
      },
      image: {
        match: "^\\d\\d\\d\\d-\\d\\d-\\d\\d-.*.(png|jpg)",
        type: "string",
        required: true,
      },
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

test("invalid frontmatter", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      title: {
        type: "string",
        required: true,
      },
    })
    .process(vfile.readSync("./test/examples/invalid.md"), (err, data) => {
      t.equal(data.messages.length, 1);
      t.equal(
        data.messages[0].message,
        "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line at line 1, column 13:\n    title: hello: world!\n                ^"
      );
      t.end();
    });
});

test("oneOf string", (t) => {
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
        t.equal(data.messages.length, 0);
        t.end();
      }
    );
});

test("match date", (t) => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      date: {
        required: true,
        match: "\\d\\d",
      },
    })
    .process(vfile.readSync("./test/examples/date-match.md"), (err, data) => {
      t.equal(data.messages.length, 0);
      t.end();
    });
});
