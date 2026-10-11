export const config = {
  port: Number(process.env.PORT ?? 4000),
  // Artificial latency for every /api call, handy for seeing loading states.
  delayMs: Number(process.env.API_DELAY_MS ?? 0),
};
