export function createServiceContentCache(loader) {
  const pending = new Map();
  const resolved = new Map();
  return {
    get: key => resolved.get(key),
    load(key) {
      if (!pending.has(key)) {
        const request = Promise.resolve().then(() => loader(key)).then(value => {
          resolved.set(key, value);
          return value;
        }).catch(error => {
          pending.delete(key);
          throw error;
        });
        pending.set(key, request);
      }
      return pending.get(key);
    },
  };
}
