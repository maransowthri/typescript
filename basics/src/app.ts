// function add(num1: number, num2: number) {
//   return num1 + num2;
// }

// const result = add(4, 5);
// console.log(result);

// const person: {
//   name: string;
//   age: number;
//   address: { state: string; pin: number };
// } = {
//   name: "Maran",
//   age: 24,
//   address: { state: "Tamil Nadu", pin: 630561 },
// };
// console.log(person.name);

// const person = {
//   hobbies: ["running", "swimming"],
// };

// for (const item of person.hobbies) {
//   console.log(item.toUpperCase());
// }

/** Tuple */

// const person: {
//   role: [number, string];
// } = {
//   role: [1, "Manager"],
// };

/** Enum */
// enum Auth {
//   AUTH_INIT = "AUTH_INIT",
//   AUTH_INPROGRESS = "AUTH_INPROGRESS",
//   AUTH_SUCCESS = "AUTH_SUCCESS",
//   AUTH_FAILED = "AUTH_FAILED",
// }

// console.log(Auth.AUTH_INIT);

/** Unions & Aliases */
// type Person = { name: string; age: number };

// const maran: Person = {
//   name: "Maran Sowthri K",
//   age: 2,
// };

/** Function Types */
// function calculateSum(number1: number, number2: number) {
//   return number1 + number2;
// }

// let sum: (a: number, b: number) => number;
// sum = calculateSum;

/** unknown types */
// let userInput: any;
// let userInput: unknown;
// let age: number;

// age = 5;
// if (typeof userInput === "number") {
//   age = userInput;
// }

console.log("Finished");
