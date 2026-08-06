/** Operational HTTP error with status code. */
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}

/** Wrap async route handlers — no try/catch boilerplate in controllers. */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
