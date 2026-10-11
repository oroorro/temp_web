export function requestLogger(req, res, next) {
  const startedAt = performance.now();
  res.on('finish', () => {
    const elapsed = (performance.now() - startedAt).toFixed(1);
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${elapsed}ms)`);
  });
  next();
}
