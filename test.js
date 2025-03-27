import { remark } from "remark";
import plugin from "./index.js";
import dedent from "dedent";
import frontmatter from "remark-frontmatter";

const processMarkdown = (md, options) => {
  return remark().use(frontmatter, ["yaml"]).use(plugin, options).process(md);
};

const worksMd = dedent`---
title: hello world!
image: 2020-10-31-black-cat.png
date: 2018-11-05T12:00:00Z
tags:
  - CSS
order: 100
offline: true
anotherBoolean: false
authors:
  - name: Katy
  - name: Jason
---

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

const invalidMd = dedent`---
title: hello: world!
image: 2020-10-31-black-cat.png
tags:
  - CSS
---

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

const regexMd = dedent`---
title: Regex example
image: cat.gif
---
`;

const lengthMd = dedent`---
title: hello world!
tags:
  - writing
  - code
  - JavaScript
id: abcd
---

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

const oneOfStringMd = dedent`---
category: code
---

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

const missingYamlMd = dedent`Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

describe("remark-frontmatter-validator", () => {
  test("the works", async () => {
    const vFile = await processMarkdown(worksMd, {
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
    });
    expect(vFile.messages.length).toBe(0);
  });

  test("invalid frontmatter", async () => {
    const vFile = await processMarkdown(invalidMd, {
      title: {
        type: "string",
        required: true,
      },
    });
    expect(vFile.messages.length).toBe(1);
    expect(vFile.messages).toMatchInlineSnapshot(`
        [
          [1:1-6:4: bad indentation of a mapping entry (1:13)

         1 | title: hello: world!
        -----------------^
         2 | image: 2020-10-31-black-cat.png
         3 | tags:],
        ]
      `);
  });

  test("missing frontmatter", async () => {
    const vFile = await processMarkdown(missingYamlMd, {
      title: {
        type: "string",
        required: true,
      },
    });
    expect(vFile.messages).toMatchInlineSnapshot(`
      [
        [1:1: The file does not contain YAML frontmatter.],
      ]
    `);
  });

  test("missing frontmatter, allowed", async () => {
    const vFile = await processMarkdown(missingYamlMd, {
      allowMissingFrontmatter: true,
      title: {
        type: "string",
        required: true,
      },
    });
    expect(vFile.messages).toMatchInlineSnapshot(`[]`);
  });

  test("isMatch", async () => {
    const vFile = await processMarkdown(regexMd, {
      image: {
        match: ".*.(jpg|png|gif)$",
      },
    });
    expect(vFile.messages.length).toBe(0);
  });

  test("isMatch, not ok", async () => {
    const vFile = await processMarkdown(regexMd, {
      image: {
        match: ".*.(jpg|png)$",
      },
    });
    expect(vFile.messages.length).toBe(1);
    expect(vFile.messages[0].message).toMatchInlineSnapshot(
      `"The value of \`image\` "cat.gif" does not match the pattern: "/.*.(jpg|png)$/""`
    );
  });

  test("isMaxLength", async () => {
    const vFile = await processMarkdown(lengthMd, {
      tags: {
        maxLength: "1",
        required: true,
      },
      id: {
        maxLength: "2",
        required: true,
      },
    });
    expect(vFile.messages.length).toBe(2);
    expect(vFile.messages).toMatchInlineSnapshot(`
        [
          [1:1: The value of \`tags\` has a maximum length of 1, the value you entered "writing,code,JavaScript" has a length of 3],
          [1:1: The value of \`id\` has a maximum length of 2, the value you entered "abcd" has a length of 4],
        ]
      `);
  });

  test("oneOf", async () => {
    const vFile = await processMarkdown(worksMd, {
      tags: {
        maxLength: "4",
        type: "object",
        required: true,
        oneOf: ["cool", "beans"],
      },
    });
    expect(vFile.messages.length).toBe(1);
    expect(vFile.messages).toMatchInlineSnapshot(`
        [
          [1:1: The value of \`tags\` "CSS" is not a valid option. Choose from: cool, beans],
        ]
      `);
  });

  test("oneOf string", async () => {
    const vFile = await processMarkdown(oneOfStringMd, {
      category: {
        type: "string",
        required: true,
        oneOf: ["code"],
      },
    });
    expect(vFile.messages.length).toBe(0);
  });

  test("isRequired", async () => {
    const vFile = await processMarkdown(worksMd, {
      title: {
        type: "string",
        required: true,
      },
      img: {
        type: "string",
        required: true,
      },
    });
    expect(vFile.messages.length).toBe(2);
    expect(vFile.messages).toMatchInlineSnapshot(`
        [
          [1:1: The field \`img\` is required],
          [1:1: The value of \`img\` must be "string", it is currently "undefined"],
        ]
      `);
  });

  test("isType, not ok", async () => {
    const vFile = await processMarkdown(worksMd, {
      tags: {
        maxLength: "4",
        type: "string",
        required: true,
      },
    });
    expect(vFile.messages.length).toBe(1);
    expect(vFile.messages).toMatchInlineSnapshot(`
        [
          [1:1: The value of \`tags\` must be "string", it is currently "object"],
        ]
      `);
  });

  test("isType, array", async () => {
    const vFile = await processMarkdown(worksMd, {
      tags: {
        maxLength: "4",
        type: "array",
        required: true,
      },
    });
    expect(vFile.messages.length).toBe(0);
  });

  test("isType, string", async () => {
    const vFile = await processMarkdown(worksMd, {
      title: {
        type: "string",
        required: true,
      },
    });
    expect(vFile.messages.length).toBe(0);
  });

  test("isType, number", async () => {
    const vFile = await processMarkdown(worksMd, {
      order: {
        type: "number",
        required: true,
      },
    });
    expect(vFile.messages.length).toBe(0);
  });

  test("isType, boolean", async () => {
    const vFile = await processMarkdown(worksMd, {
      offline: {
        type: "boolean",
        required: true,
      },
    });
    expect(vFile.messages.length).toBe(0);
  });

  test("isType, boolean", async () => {
    const vFile = await processMarkdown(worksMd, {
      anotherBoolean: {
        type: "boolean",
        required: true,
      },
    });
    expect(vFile.messages.length).toBe(0);
  });

  test("isType, date", async () => {
    const vFile = await processMarkdown(worksMd, {
      date: {
        required: true,
        type: "date",
      },
    });
    expect(vFile.messages.length).toBe(0);
  });

  test("isType, object", async () => {
    const vFile = await processMarkdown(worksMd, {
      authors: {
        required: true,
        type: "object",
      },
    });
    expect(vFile.messages.length).toBe(0);
  });
});
