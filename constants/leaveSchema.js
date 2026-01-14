const Joi = require("joi");

exports.applyLeaveSchema = Joi.object({
  leave_type: Joi.string().valid("Sick", "Casual", "Annual").required(),

  start_date: Joi.date().iso().required(),

  end_date: Joi.date().iso().min(Joi.ref("start_date")).required(),

  reason: Joi.string().trim().min(5).max(200).required(),
}).strict();
