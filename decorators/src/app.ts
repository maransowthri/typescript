// function Logger(loggingString: string) {
//   return function (target: Function) {
//     console.log(loggingString);
//     console.log(target);
//   };
// }

// function InsertElement(template: string, hookId: string) {
//   return function (constructor: any) {
//     const obj = new constructor();
//     const elem = document.getElementById(hookId)!;
//     elem.innerHTML = template + obj.name;
//   };
// }

// @InsertElement("<h1>Hello World</h1>", "app")
// class Person {
//   name = "Maran";
//   constructor() {
//     console.log("Creating person object...");
//   }
// }

// const man = new Person();

// function PropertyDecorator(target: any, propertyName: string) {
//   console.log("PropertyDecorator");
//   console.log(target);
//   console.log(propertyName);
// }

// function AccessorDecorator(
//   target: any,
//   accessorName: string,
//   descriptor: PropertyDescriptor
// ) {
//   console.log("AccessorDecorator");
//   console.log(target);
//   console.log(accessorName);
//   console.log(descriptor);
// }

// function MethodDecorator(
//   target: any,
//   methodName: string,
//   descriptor: PropertyDescriptor
// ) {
//   console.log("MethodDecorator");
//   console.log(target);
//   console.log(methodName);
//   console.log(descriptor);
// }

// function ParameterDecorator(target: any, methodName: string, position: number) {
//   console.log("ParameterDecorator");
//   console.log(target);
//   console.log(methodName);
//   console.log(position);
// }

// class Product {
//   @PropertyDecorator
//   private _price: number;

//   constructor(price: number) {
//     this._price = price;
//   }

//   get productPrice() {
//     return this._price;
//   }

//   @AccessorDecorator
//   set productPrice(@ParameterDecorator price: number) {
//     this._price = price;
//   }

//   @MethodDecorator
//   calculateTax() {
//     return this._price + 1.25;
//   }
// }

// const p1 = new Product(23);
// const p2 = new Product(235);

// function AppendConstructor(BaseClass: any) {
//   return class extends BaseClass {
//     constructor() {
//       super();
//       console.log("Added this to constructor");
//     }
//   };
// }

// @AppendConstructor
// class Employee {
//   constructor() {
//     console.log("Employee Constructor Called!");
//   }
// }

// const p1 = new Employee();

// function Autobind(_1: any, _2: string, descriptor: PropertyDescriptor) {
//   const orgDescriptor = descriptor.value;
//   const updatedDescriptor: PropertyDescriptor = {
//     configurable: true,
//     enumerable: false,
//     get() {
//       const bindFn = orgDescriptor.bind(this);
//       return bindFn;
//     },
//   };
//   return updatedDescriptor;
// }

// class Printer {
//   private _message = "It works!";

//   @Autobind
//   showMessage() {
//     console.log(this._message);
//   }
// }

// const p1 = new Printer();
// p1.showMessage();
// const buttonEl = document.querySelector("button")!;
// buttonEl.addEventListener("click", p1.showMessage);

// interface Validators {
//   [input: string]: string[];
// }

// const config: Validators = {};

// const addValidator = (input: string, type: string) => {
//   config[input] = config[input] ? [...config[input], type] : [type];
// };

// const Required = (_: any, input: string) => addValidator(input, "required");
// const Maxlength = (_: any, input: string) => addValidator(input, "maxlength");
// const Positive = (_: any, input: string) => addValidator(input, "positive");

// const validate = (course: any) =>
//   Object.entries(config).every(([input, types]) =>
//     types.every(
//       (type) =>
//         (type === "required" && course[input]) ||
//         (type === "positive" && course[input] > 0) ||
//         (type === "maxlength" && course[input].length < 5)
//     )
//   );

// class Course {
//   @Required
//   @Maxlength
//   private _title: string;
//   @Positive
//   private _price: number;

//   constructor(title: string, price: number) {
//     this._title = title;
//     this._price = price;
//   }

//   getDescription() {
//     return `${this._title} at ${this._price}`;
//   }
// }

// const formEl = document.querySelector("form")!;
// formEl.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const titleEl = document.getElementById("title")! as HTMLInputElement;
//   const priceEl = document.getElementById("price")! as HTMLInputElement;

//   const title = titleEl.value;
//   const price = +priceEl.value;

//   const course = new Course(title, price);
//   if (!validate(course)) {
//     alert("Invalid Inputs");
//     return;
//   }
//   console.log(course);
// });

enum Validators {
  Required,
  Maxlength,
  PositiveNUmber,
}

interface ValidatorsType {
  [input: string]: Validators[];
}

const validatorsConfig: ValidatorsType = {};

function addValidator(input: string, type: Validators) {
  validatorsConfig[input] = validatorsConfig[input]
    ? [...validatorsConfig[input], type]
    : [type];
}

function Required(_: any, input: string) {
  addValidator(input, Validators.Required);
}

function Maxlength(_: any, input: string) {
  addValidator(input, Validators.Maxlength);
}

function PositiveNUmber(_: any, input: string) {
  addValidator(input, Validators.PositiveNUmber);
}

function validate(obj: any) {
  return Object.entries(validatorsConfig).every(([input, types]) =>
    types.every(
      (type) =>
        (type === Validators.Required && obj[input]) ||
        (type === Validators.Maxlength && obj[input].length < 10) ||
        (type === Validators.PositiveNUmber && obj[input] > 0)
    )
  );
}

class Course {
  @Required
  @Maxlength
  private _title: string;
  @PositiveNUmber
  private _price: number;

  constructor(title: string, price: number) {
    this._title = title;
    this._price = price;
  }

  getFullTitle() {
    return `${this._title} at $ ${this._price}`;
  }
}

const formEl = document.querySelector("form")!;
formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const titleEl = document.getElementById("title")! as HTMLInputElement;
  const priceEl = document.getElementById("price")! as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const course = new Course(title, price);

  if (validate(course)) {
    console.log("Form Submitted");
    console.log(course);
  } else {
    console.log("Invalid Inputs");
  }
});
