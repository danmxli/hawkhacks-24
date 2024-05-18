// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // You can customize the status code and message depending on the error
    // For simplicity, we're using 500 as a general server error code
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    res.status(statusCode).json({
      success: false,
      error: message,
    });
  };
  
  module.exports = errorHandler;
  