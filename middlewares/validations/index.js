import { body, validationResult } from "express-validator";

const registerValdidations = () => {
  return [
    body("email", "Email is required").isEmail(),
    body("username", "Username with min 5 char length")
      .notEmpty()
      .isLength({ minLength: 5 }),
    body("fullName", "Fullname which is more than 5 char")
      .notEmpty()
      .isLength({ minLength: 5 }),
    body(
      "password",
      "Password with at least 1 number,UpperCase, LowerCase and a special Charachter which is 8 Characters long"
    ).isStrongPassword(),
    body("password2").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw console.error("password does not match");
      }
      return true;
    }),
  ];
};

const isBookValidated = () => {
  return [
    body("title", "title must be min 3 char long").isLength({ minLength: 3 }),
    body("author", "author name must be min 3 char long").isLength({
      minLength: 3,
    }),
    body("coverImageURL", "Valid Image URL is required").isURL(),
    body("synopsis", "A synopsis longer than 10 words").isLength({
      minLength: 10,
    }),
    body("publisher", "publisher name more than 3 charachters").isLength({
      minLength: 3,
    }),
    body("pageCount", "page count which is a valid number").isNumeric(),
    body("ISBN", "valid ISBN number").isLength({ minLength: 10 }),
  ];
};

const errorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export { errorMiddleware, isBookValidated, registerValdidations };
