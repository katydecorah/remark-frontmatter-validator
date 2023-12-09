export const isRequired = (file, label, field) => {
  if (!field) file.message(`The field \`${label}\` is required`);
};
