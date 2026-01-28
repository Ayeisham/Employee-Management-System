const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, //collect all errors 
      allowUnknown: false, //dont accept unknown values 
      convert: true, //type casting
      scriptUnknown: true, //ignore malicious scripts
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((d) => d.message),
      });
    }

    req[property] = value; // clean validated data
    next();
  };
};

module.exports = validate;
