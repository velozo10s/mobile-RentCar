export const flushPromises = () => new Promise<void>(r => setImmediate(r));
