export default function successResponse(res, httpCode, message, data) {
  return res.status(httpCode).json({
    status: 'success',
    message,
    data,
  });
}
