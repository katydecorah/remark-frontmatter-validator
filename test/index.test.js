import { remark } from "remark";
import plugin from "../index.js";
import frontmatter from "remark-frontmatter";
import { readSync } from "to-vfile";

describe("remark-frontmatter-validator", () => {
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

  test("isMatch", () => {
    remark()
      .use(frontmatter, ["yaml"])
      .use(plugin, {
        image: {
          match: ".*.(jpg|png|gif)$",
        },
      })
      .process(readSync("./test/examples/regex.md"), (err, data) => {
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
      .process(readSync("./test/examples/regex.md"), (err, data) => {
        expect(data.messages.length).toBe(1);
        expect(data.messages[0].message).toMatchInlineSnapshot(
          `"The value of \`image\` "cat.gif" does not match the pattern: "/.*.(jpg|png)$/""`
        );
      });
  });

  test("isMaxLength", () => {
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
      .process(readSync("./test/examples/length.md"), (err, data) => {
        expect(data.messages.length).toBe(2);
        expect(data.messages).toMatchInlineSnapshot(`
        [
          [./test/examples/length.md:1:1: The value of \`tags\` has a maximum length of 1, the value you entered "writing,code,JavaScript" has a length of 3],
          [./test/examples/length.md:1:1: The value of \`id\` has a maximum length of 2, the value you entered "abcd" has a length of 4],
        ]
      `);
      });
  });

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
      .process(readSync("./test/examples/works.md"), (err, data) => {
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
      .process(readSync("./test/examples/one-of-string.md"), (err, data) => {
        expect(data.messages.length).toBe(0);
      });
  });

  test("isRequired", () => {
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
      .process(readSync("./test/examples/works.md"), (err, data) => {
        expect(data.messages.length).toBe(2);
        expect(data.messages).toMatchInlineSnapshot(`
        [
          [./test/examples/works.md:1:1: The field \`img\` is required],
          [./test/examples/works.md:1:1: The value of \`img\` must be "string", it is currently "undefined"],
        ]
      `);
      });
  });

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
      .process(readSync("./test/examples/works.md"), (err, data) => {
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
      .process(readSync("./test/examples/works.md"), (err, data) => {
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
      .process(readSync("./test/examples/works.md"), (err, data) => {
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
      .process(readSync("./test/examples/works.md"), (err, data) => {
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
      .process(readSync("./test/examples/works.md"), (err, data) => {
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
      .process(readSync("./test/examples/works.md"), (err, data) => {
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
      .process(readSync("./test/examples/works.md"), (err, data) => {
        expect(data.messages.length).toBe(0);
      });
  });
});
