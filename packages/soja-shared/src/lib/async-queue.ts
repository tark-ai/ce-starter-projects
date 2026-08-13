/**
 * Serializes operations onto one promise chain so their responses commit in call
 * order. The wishlist endpoints each return the whole list, so two overlapping
 * requests let the older response overwrite the newer one.
 */
export function createSerialQueue() {
  let tail: Promise<unknown> = Promise.resolve();

  return function enqueue<T>(operation: () => Promise<T>): Promise<T> {
    // Both handlers run the operation, so one caller's rejection cannot skip the next.
    const result = tail.then(operation, operation);
    tail = result.catch(() => undefined);
    return result;
  };
}
