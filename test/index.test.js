"use strict";

const remark = require("remark");
const plugin = require("../index.js");
const frontmatter = require("remark-frontmatter");
const vfile = require("to-vfile");

test("the works", () => {
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
      expect(data.messages.length).toBe(0);
    });
});

test("invalid frontmatter", () => {
  remark()
    .use(frontmatter, ["yaml"])
    .use(plugin, {
      title: {
        type: "string",
        required: true,
      },
    })
    .process(vfile.readSync("./test/examples/invalid.md"), (err, data) => {
      expect(data.messages.length).toBe(1);
      expect(data.messages[0].message).toMatchInlineSnapshot(`
        "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line at line 1, column 13:
            title: hello: world!
                        ^"
      `);
    });
});
