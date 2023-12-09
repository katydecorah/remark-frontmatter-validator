import { remark } from "remark";
import plugin from "../index.js";
import frontmatter from "remark-frontmatter";
import { readSync } from "to-vfile";

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
    .process(readSync("./test/examples/works.md"), (err, data) => {
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
    .process(readSync("./test/examples/invalid.md"), (err, data) => {
      expect(data.messages.length).toBe(1);
      expect(data.messages[0].message).toMatchInlineSnapshot(`
        "bad indentation of a mapping entry (1:13)

         1 | title: hello: world!
        -----------------^
         2 | image: 2020-10-31-black-cat.png
         3 | tags:"
      `);
    });
});
