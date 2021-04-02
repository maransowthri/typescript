// class Employee {
//   constructor(public fullName: string, public department: string) {}

//   describe(this: Employee) {
//     console.log(`${this.fullName} from ${this.department}`);
//   }
// }

// const maran = new Employee("Maran Sowthri K", "ECE");
// maran.describe();

// const newMaran = {
//   fullName: "Maran K",
//   department: "ECE",
//   describe: maran.describe,
// };
// newMaran.describe();

// class Department {
//   constructor(private departmentName: string) {}

//   get deptName() {
//     return this.departmentName;
//   }

//   set deptName(newDeptName: string) {
//     this.departmentName = newDeptName;
//   }
// }

// class ECE extends Department {
//   private static fullDeptName: string =
//     "Electronics and Communication Engineering";
//   private dptName: string;

//   constructor(dptName: string) {
//     super(dptName);
//     this.dptName = dptName;
//   }

//   departmentCode() {
//     return this.dptName;
//   }

//   static get fullDepartmentName() {
//     return `${ECE.fullDeptName}`;
//   }
// }

// const ece = new ECE("ECE");
// ece.deptName = "Electronics and Communication Engineering";
// console.log(ece.deptName);
// console.log(ECE.fullDepartmentName);

/** Abstraction */
// abstract class Department {
//   abstract get departmentName(): string;
// }

// class ECE extends Department {
//   get departmentName() {
//     return "ECE";
//   }
// }

/** Interfaces - Pure Abstraction */
interface Person {
  name: string;
  age: number;
  greeting(period: string): void;
}

// let employee: Person;
// employee = {
//   name: "Maran",
//   age: 24,
//   greeting(period: string) {
//     console.log(`Good ${period}, ${this.name}`);
//   },
// };

class Employee implements Person {
  name: string = "Person";
  age: number = 24;

  public greeting(period: string) {
    return `Good ${period}, ${this.name} - ${this.age} years old`;
  }
}

// employee.greeting("Morning");
