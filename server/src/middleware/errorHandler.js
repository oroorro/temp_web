import { HttpError } from '../utils/httpError.js';

export function notFoundHandler(req, _res, next) {
  next(new HttpError(404, `No route for ${req.method} ${req.originalUrl}`));
}

// Express recognises error handlers by their four-argument signature.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const isMalformedJson = err.type === 'entity.parse.failed';
  const status = isMalformedJson ? 400 : (err.status ?? 500);

  if (status >= 500) console.error(err);

  res.status(status).json({
    error: {
      message: isMalformedJson
        ? 'Request body is not valid JSON'
        : status >= 500
          ? 'Internal server error'
          : err.message,
      details: err.details,
    },
  });
}
