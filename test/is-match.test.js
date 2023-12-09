import { remark } from "remark";
import plugin from "../index.js";
import frontmatter from "remark-frontmatter";
import { readSync } from "to-vfile";

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
