import BaseError from './baseError';

class APIError extends BaseError {
  constructor(name, httpCode, message = 'internal server error') {
    super(name, httpCode, message);
  }
}

const handleError = (err, res) => {
  const { httpCode, message } = err;
  const code = httpCode || 500;
  res.status(code).json({
    status: 'error',
    httpCode: code,
    message,
  });
};

export { APIError, handleError };
