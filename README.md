# remark-frontmatter-validator ![Test](https://github.com/katydecorah/remark-frontmatter-validator/workflows/Test/badge.svg)

A [remark](https://github.com/remarkjs/remark-lint) plugin to validate the values in your frontmatter.

## Install

Install the plugin and remark-frontmatter:

```
npm install remark-frontmatter-validator remark-frontmatter --save-dev
```

Add the plugin to your `.remarkrc` and define the shape of your frontmatter:

```json
{
  "plugins": [
    ["remark-frontmatter", ["yaml"]],
    [
      "remark-frontmatter-validator",
      [
        2,
        {
          "title": {
            "type": "string",
            "required": true
          },
          "image": {
            "type": "string",
            "required": true
          },
          "tags": {
            "type": "array"
          }
        }
      ]
    ]
  ]
}
```

## Options

The plugin accepts an object that describes the fields in your frontmatter. Each key of the object should match a key in your frontmatter. The key's value is an object that describes the value.

In the example below, `title` is a required value and it must be a string:

```json
"title": {
  "type": "string",
  "required": true
}
```

### Field object

The key's value is an object that describes the value.

- `type` - The value's type: `string`, `object`, `number`, `boolean`, `array`, or `date`.
- `maxLength` - The value's maximum length.
- `oneOf` - An array of options that the value must match.
- `match` - A [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) that the value must match.
- `required` - Set the value as `true` if it is required.

In the example below, there can be up to 2 `tags` and it can match "writing", "code", or "notes":

```json
"tags": {
  "type": "array",
  "maxLength": 2,
  "oneOf": ["writing", "code", "notes"]
}
```

In the example below, the `image` path must match the regex (where `2020-10-31-cat.png` is valid and `cat.gif` is invalid) and it is required:

```json
"image": {
  "match": "^\\d\\d\\d\\d-\\d\\d-\\d\\d-.*.(png|jpg)",
  "type": "string",
  "required": true
},
```
