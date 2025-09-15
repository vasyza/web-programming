function makeCounter() {
  let count = 0;
  return function () {
    return count++;
  };
}

const counter = makeCounter();
console.log(counter()); // Output: 0
console.log(counter()); // Output: 1
console.log(counter()); // Output: 2
