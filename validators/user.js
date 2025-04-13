const { body } = require("express-validator");

const passwordRegrex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

exports.validateAddUser = [
  body("firstName")
    // .isEmpty()
    // .withMessage("firstName is required")
    .isString()
    .withMessage("firstName Should Be String")
    .isLength({ min: 3, max: 50 })
    .withMessage("firstName shouldn be 3 to 50 charecter long"),

  body("LastName")
    // .isEmpty()
    // .withMessage("LastName is required")
    .isString()
    .withMessage("LastName Should Be String")
    .isLength({ min: 3, max: 50 })
    .withMessage("LastName shouldn be 3 to 50 charecter long"),

  body("email")
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .isEmpty()
    .withMessage("Password is required")
    .matches(passwordRegrex)
    .withMessage(
      "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a digit, and a special character"
    ),

  body("mobileNumber")
    //     .isEmpty()
    //     .withMessage("mobileNumber is required")
    .isNumeric()
    .withMessage("mobileNumber should be numeric")
    .isLength({ min: 10, max: 10 }),
];
