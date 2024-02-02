import joi from "joi";

const allowedJuiceTypes = [
  "fruit-juice",
  "smoothies",
  "protein-shake",
  "winter-menu",
  "vegetable-juice",
  "chocolate-juice",
  "mocktail",
];
const juiceValdiationSchema = joi
  .string()
  .valid(...allowedJuiceTypes)
  .required();

export default function juiceTypeValidator(juiceType) {
  const { error } = juiceValdiationSchema.validate(juiceType);
  if (error) {
    return false;
  } else {
    return true;
  }
}
