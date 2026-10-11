export function delay(ms) {
  return (_req, _res, next) => {
    if (ms > 0) setTimeout(next, ms);
    else next();
  };
}
