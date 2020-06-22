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
      image: {
        match: ".*.(jpg|png|gif)$",
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
      image: {
        match: ".*.(jpg|png)$",
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

test("maxlength", (t) => {
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
        'The maximum length of `tags` value is 1, the value you entered "writing,code,JavaScript" has a length of 3'
      );
      t.equal(
        data.messages[1].message,
        'The maximum length of `id` value is 2, the value you entered "abcd" has a length of 4'
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
