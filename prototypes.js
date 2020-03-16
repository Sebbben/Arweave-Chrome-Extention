Array.prototype.random = function() {
  return this[Math.floor(Math.random() * (this.length - 1))];
};

Array.prototype.lastElement = function() {
  return this[this.length - 1];
};

Object.getPrototypeOf(localStorage).getObject = function(key) {
  return JSON.parse(window.localStorage.getItem(key));
};

Object.getPrototypeOf(localStorage).setObject = function(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
};
