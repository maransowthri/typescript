// const names = ["Karan", "Kalees"];

// const promise: Promise<string> = new Promise((resolve) => {
//   setTimeout(() => {
//     resolve("This is done");
//   });
// });

// promise.then((data) => data.length);

// function merge<T extends object, U extends object>(objA: T, objB: U) {
//   return { ...objA, ...objB };
// }

// console.log(merge({ name: "Maran" }, { age: 24 }));
// const person = merge({ name: "Maran" }, { age: 23 });
// console.log(person);

// interface Lengthy {
//   length: number;
// }

// function countAndDescribe<T extends Lengthy>(element: T): string {
//   let describe = "Got no value";

//   if (element.length > 0) {
//     describe = `Got ${element.length} elements`;
//   }

//   return describe;
// }

// console.log(countAndDescribe(["KMARAN", "KSOWTHRI"]));

// function getValue<T extends object, U extends keyof T>(obj: T, key: U) {
//   return obj[key];
// }

// const value = getValue({ age: 25 }, "age");

// class DataStorage<T> {
//   private data: T[] = [];

//   public addItem(item: T) {
//     this.data.push(item);
//   }

//   public removeItem(item: T) {
//     if (this.data.indexOf(item) === -1) {
//       this.data.splice(this.data.indexOf(item), 1);
//     }
//   }

//   public getData() {
//     return this.data;
//   }
// }

// const storage = new DataStorage<string>();
// storage.addItem("Karan");
// storage.addItem("2");
// storage.removeItem("Karan");
// console.log(storage.getData());

// interface Person {
//   name: string;
//   age: number;
//   nicknames: string[];
// }

// function getPerson(name: string, age: number, nicknames: string[]): Person {
//   const person: Partial<Person> = {};
//   person.name = name;
//   person.age = age;
//   person.nicknames = nicknames;
//   return person as Person;
// }

// const names: Readonly<string[]> = ["Karan", "Kalees"];
// names.push("Maran");

// function getLastElement<T>(items: T[]): T {
//   return items[items.length - 1];
// }

// const lastString = getLastElement(["Karan", "Kalees", "Mahesh"]);
// const lastNumber = getLastElement([1, 2, 3]);
// console.log(lastString);
// console.log(lastNumber);

// function merge<T, U>(objA: T, objB: U) {
//   return { ...objA, ...objB };
// }

// function countAndDescribe<T extends { length: number }>(
//   element: T
// ): [T, string] {
//   let describe = "Got no value";

//   if (element.length === 1) {
//     describe = "Got 1 value";
//   } else if (element.length > 1) {
//     describe = `Got ${element.length} values`;
//   }
//   return [element, describe];
// }

// console.log(countAndDescribe(["Karan", "Kalees"]));
// console.log(countAndDescribe("Karan Sasthiri K"));

interface Person {
  name: string;
  age: number;
}

const person: Partial<Person> = {
  name: "Maran",
  age: 23,
  // designation: "Software Engineer",
};
