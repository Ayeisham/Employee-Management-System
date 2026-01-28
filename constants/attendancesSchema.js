const Joi = require("joi");

exports.logAttendanceSchema = Joi.object({
  type: Joi.string().valid("checkIn", "checkOut").required().messages({
    "any.only": "Type must be either checkIn or checkOut",
  }),
}).strict();
