const Joi = require("joi");

exports.applyLeaveSchema = Joi.object({
  leave_type: Joi.string().valid("Sick", "Casual", "Annual").required(),

  start_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "DOB must be in format YYYY-MM-DD",
      "any.required": "Date of birth is required",
    }),

  end_date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "DOB must be in format YYYY-MM-DD",
      "any.required": "Date of birth is required",
    }),

  reason: Joi.string().trim().min(5).max(200).required(),
}).strict();
