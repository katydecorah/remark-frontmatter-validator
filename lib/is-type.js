export const isType = (file, label, value, type) => {
  switch (type) {
    case "string":
      if (!isTypeString(value)) createMessage(file, label, type, value);
      break;
    case "object":
      if (!isTypeObject(value)) createMessage(file, label, type, value);
      break;
    case "number":
      if (!isTypeNumber(value)) createMessage(file, label, type, value);
      break;
    case "boolean":
      if (!isTypeBoolean(value)) createMessage(file, label, type, value);
      break;
    case "array":
      if (!isTypeArray(value)) createMessage(file, label, type, value);
      break;
    case "date":
      if (!isTypeDate(value)) createMessage(file, label, type, value);
      break;
    default:
      file.message(`The type "${type}" is invalid.`);
  }
};

const createMessage = (file, label, type, value) =>
  file.message(
    `The value of \`${label}\` must be "${type}", it is currently "${typeof value}"`
  );

const isTypeString = (value) => typeof value === "string";
const isTypeObject = (value) => typeof value === "object";
const isTypeNumber = (value) => typeof value === "number";
const isTypeBoolean = (value) => typeof value === "boolean";
const isTypeArray = (value) => Array.isArray(value);
const isTypeDate = (value) => value instanceof Date;
