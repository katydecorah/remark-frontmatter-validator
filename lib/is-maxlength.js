export const isMaxLength = (file, label, value, maxLength) => {
  if (value.length > maxLength)
    file.message(
      `The value of \`${label}\` has a maximum length of ${maxLength}, the value you entered "${value}" has a length of ${value.length}`
    );
};
