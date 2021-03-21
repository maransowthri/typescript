function Autobind(_: any, _1: string, descriptor: PropertyDescriptor) {
  const orgDescriptor = descriptor.value;
  const updatedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const bindFn = orgDescriptor.bind(this);
      return bindFn;
    },
  };
  return updatedDescriptor;
}

enum Validators {
  Required = "REQUIRED",
  MaxLength = "MAX_LENGTH",
  PositiveNumber = "POSITIVE_NUMBER",
}

interface ValidatorConfig {
  [input: string]: {
    validate: Validators;
    extra_args: { maxLength?: number };
  }[];
}

const validatorsConfig: ValidatorConfig = {};

function addValidator(
  input: string,
  validator: Validators,
  extra_args: object = {}
) {
  validatorsConfig[input] = validatorsConfig[input]
    ? [...validatorsConfig[input], { validate: validator, extra_args }]
    : [{ validate: validator, extra_args }];
}

function Required(_: any, input: string) {
  addValidator(input, Validators.Required);
}

function MaxLength(maxLength: number = 10) {
  return function (_: any, input: string) {
    addValidator(input, Validators.MaxLength, { maxLength });
  };
}

function PositiveNumber(_: any, input: string) {
  addValidator(input, Validators.PositiveNumber);
}

function validate(obj: any) {
  return Object.keys(validatorsConfig).every((key) =>
    validatorsConfig[key].every((validation) => {
      switch (validation.validate) {
        case Validators.Required:
          return obj[key].toString().trim().length > 0;
        case Validators.MaxLength:
          return obj[key].length < validation.extra_args.maxLength!;
        case Validators.PositiveNumber:
          return obj[key] > 0;
        default:
          return true;
      }
    })
  );
}

class ProjectList {
  private _templateEl: HTMLTemplateElement;
  private _appEl: HTMLDivElement;
  private _sectionEl: HTMLElement;

  constructor(private _projectType: "active" | "finished") {
    this._templateEl = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this._appEl = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this._templateEl.content, true);
    this._sectionEl = importedNode.firstElementChild! as HTMLElement;
    this._sectionEl.id = `${this._projectType}-projects`;

    this._attach();
    this._renderContent();
  }

  private _attach() {
    this._appEl.insertAdjacentElement("beforeend", this._sectionEl);
  }

  private _renderContent() {
    this._sectionEl.querySelector(
      "h2"
    )!.textContent = `${this._projectType.toUpperCase()} PROJECTS`;
  }
}

class ProjectInput {
  private _templateEl: HTMLTemplateElement;
  private _appEl: HTMLDivElement;
  private _formEl: HTMLFormElement;
  private _titleInEl: HTMLInputElement;
  private _descInEl: HTMLInputElement;
  private _peopleInEl: HTMLInputElement;
  @Required
  @MaxLength(10)
  title: string = "";
  @Required
  desc: string = "";
  @Required
  @PositiveNumber
  people: number = 0;

  constructor() {
    this._templateEl = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this._appEl = document.getElementById("app")! as HTMLDivElement;

    const importNode = document.importNode(this._templateEl.content, true);
    this._formEl = importNode.firstElementChild! as HTMLFormElement;
    this._titleInEl = this._formEl.querySelector("#title")! as HTMLInputElement;
    this._descInEl = this._formEl.querySelector(
      "#description"
    )! as HTMLInputElement;
    this._peopleInEl = this._formEl.querySelector(
      "#people"
    )! as HTMLInputElement;

    this._configure();
    this._attach();
  }

  private _attach() {
    this._appEl.insertAdjacentElement("afterbegin", this._formEl);
  }

  private _clearInputs() {
    this._titleInEl.value = "";
    this._descInEl.value = "";
    this._peopleInEl.value = "";
  }

  private _gatherInputs(): {
    title: string;
    desc: string;
    people: number;
  } | void {
    this.title = this._titleInEl.value;
    this.desc = this._descInEl.value;
    this.people = +this._peopleInEl.value;
    const inputObj = {
      title: this.title,
      desc: this.desc,
      people: this.people,
    };

    if (validate(inputObj)) {
      return inputObj;
    } else {
      alert("Invalid Inputs");
      return;
    }
  }

  @Autobind
  private _submitHandler(event: Event) {
    event.preventDefault();
    const output = this._gatherInputs();

    if (output) {
      console.log(output);
      this._clearInputs();
    }
  }

  private _configure() {
    this._formEl.addEventListener("submit", this._submitHandler);
  }
}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
