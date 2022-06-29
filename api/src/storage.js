const storage = require("node-persist");
const events = require("events");
const updateEvent = new events.EventEmitter();

module.exports = {
  updateEvent,
  getItem: (key) => storage.getItem(key),
  setItem: (key, value) =>
    storage.setItem(key, value).then(() => {
      updateEvent.emit(key);
    }),
  init: () =>
    storage.init({
      dir: "./storage",
    }),
};
