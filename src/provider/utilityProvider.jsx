export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = (func, delay) => {
  let waiting = false;
  return (...args) => {
    if(!waiting) {
      func(...args);
      waiting = true;
      setTimeout(() => { waiting = false }, delay);
    }
  }
}

export const isEmpty = (input) => {
  if (
       typeof input === "undefined" ||
       input === null ||
       input === "" ||
       input === "null" ||
       input.length === 0 ||
       (typeof input === "object" && !Object.keys(input).length)
      )
  {
      return true;
  }
  else return false;
}

export const areArraysEqual = (a, b) => {
  a.length === b.length && a.every((value, index) => value === b[index]);
}