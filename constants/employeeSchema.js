const Joi = require("joi");

exports.createEmployeeSchema = Joi.object({
  employee_id: Joi.string()
    .trim()
    .pattern(/^[A-Za-z0-9_-]+$/)
    .max(20)
    .required()
    .messages({
      "string.pattern.base": "Employee ID contains invalid characters",
    }),

  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Invalid email format",
    }),

  first_name: Joi.string()
    .trim()
    .pattern(/^[A-Za-z\s]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.pattern.base": "First name must contain only letters",
    }),

  last_name: Joi.string()
    .trim()
    .pattern(/^[A-Za-z\s]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.pattern.base": "Last name must contain only letters",
    }),

  father_name: Joi.string()
    .trim()
    .pattern(/^[A-Za-z\s]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.pattern.base": "Father name must contain only letters",
    }),

  cnic: Joi.string()
    .pattern(/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/)
    .required()
    .messages({
      "string.pattern.base": "CNIC must be in format 12345-1234567-1",
    }),

  dob: Joi.date().iso().max("now").required().messages({
    "date.max": "Date of birth cannot be in the future",
    "date.format": "DOB must be in ISO format (YYYY-MM-DD)",
  }),

  address: Joi.string().trim().min(10).max(200).required(),

  salary: Joi.number().precision(2).positive().max(10000000).required(),

  department_id: Joi.string()
    .trim()
    .pattern(/^[A-Za-z]+$/)
    .max(20)
    .required(),

  manager_id: Joi.string()
    .trim()
    .pattern(/^[A-Za-z0-9_-]+$/)
    .max(20)
    .allow(null),

  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]+$/)
    .required()
    .messages({
      "string.pattern.base": "Password must contain letters and numbers",
    }),
}).strict();
