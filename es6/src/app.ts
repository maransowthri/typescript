// const add = (...numbers: number[]) => {
//   return numbers.reduce(
//     (currentResult, currentValue) => currentResult + currentValue,
//     0
//   );
// };

// console.log(add(4, 5, 5, 6));

// const add = (...numbers: [number, number, number]) => {
//   return numbers.reduce(
//     (currentResult, currentValue) => currentResult + currentValue,
//     0
//   );
// };

// console.log(add(4, 5, 5));

const person = {
  firstName: "Maran",
  age: 24,
};

const { firstName: userFirstName } = person;
console.log(userFirstName);
