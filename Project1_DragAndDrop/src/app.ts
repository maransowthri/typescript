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

enum ProjectStatus {
  ACTIVE = "active",
  FINISHED = "finished",
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public desc: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

type Listener = (items: Project[]) => void;

class ProjectState {
  private _projects: Project[] = [];
  private _listeners: Listener[] = [];
  private static _instance: ProjectState;

  static getInstance() {
    if (!ProjectState._instance) {
      this._instance = new ProjectState();
    }
    return ProjectState._instance;
  }

  addProject(title: string, desc: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      desc,
      people,
      ProjectStatus.ACTIVE
    );

    this._projects.push(newProject);

    for (const listenerFn of this._listeners) {
      listenerFn(this._projects.slice());
    }
  }

  addListeners(listenerFn: Listener) {
    this._listeners.push(listenerFn);
  }
}

class ProjectList {
  private _templateEl: HTMLTemplateElement;
  private _appEl: HTMLDivElement;
  private _sectionEl: HTMLElement;
  private _assignedProjects: Project[] = [];

  constructor(private _projectType: ProjectStatus) {
    this._templateEl = document.getElementById(
      "project-list"
    )! as HTMLTemplateElement;
    this._appEl = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(this._templateEl.content, true);
    this._sectionEl = importedNode.firstElementChild! as HTMLElement;
    this._sectionEl.id = `${this._projectType}-projects`;

    projectState.addListeners((projects: Project[]) => {
      const filteredProjects = projects.filter((project: Project) => {
        if (this._projectType === ProjectStatus.ACTIVE) {
          return project.status === ProjectStatus.ACTIVE;
        } else {
          return project.status === ProjectStatus.FINISHED;
        }
      });
      this._assignedProjects = filteredProjects;
      this._renderProjects();
    });

    this._attach();
    this._renderContent();
  }

  private _attach() {
    this._appEl.insertAdjacentElement("beforeend", this._sectionEl);
  }

  private _renderProjects() {
    const listEl = document.getElementById(
      `${this._projectType}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const projectItem of this._assignedProjects) {
      const li = document.createElement("li");
      li.textContent = projectItem.title;
      listEl.appendChild(li);
    }
  }

  private _renderContent() {
    const listId = `${this._projectType}-projects-list`;
    this._sectionEl.querySelector("ul")!.id = listId;
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
      const { title, desc, people } = inputObj;
      projectState.addProject(title, desc, people);
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

const projectState = ProjectState.getInstance();
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList(ProjectStatus.ACTIVE);
const finishedProjectList = new ProjectList(ProjectStatus.FINISHED);
