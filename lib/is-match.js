export const isMatch = (file, label, value, regex) => {
  regex = new RegExp(regex);
  if (!value.match(regex)) {
    file.message(
      `The value of \`${label}\` "${value}" does not match the pattern: "${regex}"`
    );
  }
};
