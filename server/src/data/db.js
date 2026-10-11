import { createSeed } from './seed.js';

// In-memory store: every restart begins from the seed again.
export const db = createSeed();
