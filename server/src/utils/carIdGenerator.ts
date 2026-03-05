import Counter from "../models/Counter";

/**
 * Atomically increments the "carId" counter and returns a zero-padded string.
 *
 * Examples: "001", "002", ..., "999", "1000"
 *
 * Uses `findOneAndUpdate` with `upsert: true` so the Counter doc is created
 * automatically on the very first call. The `{ new: true }` option returns the
 * document *after* the increment, giving us the next available sequence number.
 */
export async function getNextCarId(): Promise<string> {
  const counter = await Counter.findOneAndUpdate(
    { _id: "carId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  return String(counter.seq).padStart(3, "0");
}
