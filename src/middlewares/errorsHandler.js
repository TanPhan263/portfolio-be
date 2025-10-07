export const errorsHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    console.log("Erorr:", err);
  }

  res.status(statusCode).json({
    message,
    ...(!isProduction && { stack: err.stack, err }),
  });
};
