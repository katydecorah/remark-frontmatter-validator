import { remark } from "remark";
import plugin from "../index.js";
import frontmatter from "remark-frontmatter";
import { readSync } from "to-vfile";

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
