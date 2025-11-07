import joi from "joi";
export const isValid = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(
      { ...req.body, ...req.params , ...req.query},
      { abortEarly: false }
    );
    if (error) {
      throw new Error(error.message, { cause: 400 });
    }
    next();
  };
};

export const generalFields = {
  email: joi.string().email({ tlds: { allow: ["com"] } }),
  password: joi.string().min(8),
  phoneNumber: joi.string().length(11),
  name: joi.string().min(3).max(30),
  dop: joi.date(),
  otp: joi.string().length(5),
  rePassword: (ref) => joi.string().min(8).valid(joi.ref(ref)),
  objectId: joi.string().hex().length(24),
};
