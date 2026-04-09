const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error to console for dev
  console.error('[GLOBAL_ERROR_TRAP]', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with ID of ${err.value}`;
    error = new Error(message);
    error.statusCode = 404;
  }

  // Final Response Wrapper Guaranteed
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Severe Server Error Intercepted',
    context: 'Global Exception Caught'
  });
};

module.exports = errorHandler;
