
export const createLogger = () => ({
  log(...args) {
    console.log(...args);
  },

  client(...args) {
    if (process.client) {
      console.log(...args);
    }
  },

  server(...args) {
    if (process.server) {
      console.log(...args);
    }
  },
});

export default createLogger();
