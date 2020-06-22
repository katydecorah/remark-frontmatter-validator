# remark-frontmatter-validator

A [remark](https://github.com/remarkjs/remark-lint) plugin to validate the values in your frontmatter.

## Install

Instal the plugin and remark-frontmatter:

```
npm install remark-frontmatter-validator remark-frontmatter --save-dev
```

Add the plugins to your `.remarkrc`:

```json
{
  "plugins": [
    ["remark-frontmatter", ["yaml"]],
    [
      "remark-frontmatter-validator",
      [
        2,
        {
          "required": {
            "title": {
              "type": "string"
            },
            "image": {
              "type": "string"
            }
          },
          "optional": {
            "tags": {
              "type": "object"
            }
          }
        }
      ]
    ]
  ]
}
```

## Options

The plugin takes two options:

- required
- optional

Both are formatted similarly, however all required keys are required.

The shape is an object, where the key matches the key in the frontmatter:

```json
"title": {
  "type": "string"
}
```

You can further describe each value:

- `type` - The values [type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof).
- `maxLength` - The value's maximum length.
- `oneOf` - An array of options that the value must match.,
- `match` - A [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) that the value must match.

There can be up to 2 tags and it can match writing, code, or notes:

```json
"tags": {
  "type": "object",
  "maxLength": 2,
  "oneOf": ["writing", "code", "notes"]
}
```

The image path must the regex(✅ `2020-10-31-cat.png`, 🚫 `cat.gif`):

```json
"image": {
  "match": "^\\d\\d\\d\\d-\\d\\d-\\d\\d-.*.(png|jpg)",
  "type": "string"
},
```
