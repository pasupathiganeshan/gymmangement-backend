// Error handler middleware
const logger = require("../logger");
const Yup = require("yup");

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  if (err instanceof Yup.ValidationError) {
    const uniqueErrors = [];
    const seenPaths = new Set();
    err.inner.forEach((error) => {
      if (!seenPaths.has(error.path)) {
        seenPaths.add(error.path);
        uniqueErrors.push({
          path: error.path,
          message: error.message,
        });
      }
    });
    statusCode = 400;
    errorMessage = uniqueErrors;
  } else if (err?.message?.includes("email_1 dup")) {
    statusCode = 400;
    errorMessage = "Email already registered";
  } else if (
    err?.message?.includes("phone_1 dup") ||
    err?.message?.includes("contact_1 dup")
  ) {
    statusCode = 400;
    errorMessage = "Contact already registered";
  } else if (err?.message?.includes("ticketNumber_1 dup")) {
    statusCode = 400;
    errorMessage = "Ticket number already exists";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    errorMessage = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    errorMessage = "Token expired";
  } else {
    logger.error(err);
  }

  if (errorMessage instanceof Array) {
    res.status(statusCode).json({ errors: errorMessage });
  } else {
    res.status(statusCode).json({ message: errorMessage });
  }
};

module.exports = errorHandler;
