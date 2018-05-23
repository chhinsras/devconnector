const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  // if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
  //   errors.handle = "Handle must be between 2 and 40 characters";
  // }

  if (Validator.isEmpty(data.title)) {
    errors.title = "Job Title Handle is required";
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = "Company name is required";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "From Date is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
