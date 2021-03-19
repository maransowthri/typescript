// const names = ["Karan", "Kalees"];

// const promise: Promise<string> = new Promise((resolve) => {
//   setTimeout(() => {
//     resolve("This is done");
//   });
// });

// promise.then((data) => data.length);

function merge<T extends object, U extends object>(objA: T, objB: U) {
  return { ...objA, ...objB };
}

console.log(merge({ name: "Maran" }, { age: 24 }));
const person = merge({ name: "Maran" }, { age: 23 });
console.log(person);
// person.
