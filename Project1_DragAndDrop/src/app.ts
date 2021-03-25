interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget{
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

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

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected _listeners: Listener<T>[] = [];

  addListeners(listenerFn: Listener<T>) {
    this._listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private _projects: Project[] = [];
  private static _instance: ProjectState;

  private constructor() {
    super();
  }

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
    this.updateListeners();
  }
  
  moveProject(projectId: string, newStatus: ProjectStatus){
    const project = this._projects.find(project => project.id === projectId)
    
    if(project && project.status !== newStatus) {
      project.status = newStatus
      this.updateListeners();
    }
  }
  
  updateListeners() {
    for (const listenerFn of this._listeners) {
      listenerFn(this._projects.slice());
    }
  }
}

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  protected _templateEl: HTMLTemplateElement;
  protected _baseEl: T;
  protected _newSectionEl: U;
  protected _insertAtBegin: boolean;

  constructor(
    templateElId: string,
    baseElId: string,
    insertAtBegin: boolean,
    newSectionElId?: string
  ) {
    this._templateEl = document.getElementById(
      templateElId
    )! as HTMLTemplateElement;
    this._baseEl = document.getElementById(baseElId)! as T;
    this._insertAtBegin = insertAtBegin;

    const importedNode = document.importNode(this._templateEl.content, true);
    this._newSectionEl = importedNode.firstElementChild! as U;

    
    if (newSectionElId) {
      this._newSectionEl.id = newSectionElId;
    }
    
    this.attach();
  }
  
  attach() {
    this._baseEl.insertAdjacentElement(
      this._insertAtBegin ? "afterbegin" : "beforeend",
      this._newSectionEl
      );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  private _assignedProjects: Project[] = [];

  constructor(private _projectType: ProjectStatus) {
    super("project-list", "app", false, `${_projectType}-projects`);
    this.configure();
    this.renderContent();
  }

  @Autobind
  dragOverHandler(event: DragEvent){
    if(event.dataTransfer && event.dataTransfer.types[0] === "text/plain"){
      event.preventDefault();
      const listEl = this._newSectionEl.querySelector("ul")!;
      listEl.classList.add("droppable")
    }
  }
  
  @Autobind
  dropHandler(event: DragEvent){
    const projectId = event.dataTransfer!.getData("text/plain")
    projectState.moveProject(projectId, this._projectType === ProjectStatus.ACTIVE ? ProjectStatus.ACTIVE : ProjectStatus.FINISHED)
  }
  
  @Autobind
  dragLeaveHandler(_: DragEvent){
    const listEl = this._newSectionEl.querySelector("ul")!;
    listEl.classList.remove("droppable")
  }
  
  configure() {
    this._newSectionEl.addEventListener("dragover", this.dragOverHandler)
    this._newSectionEl.addEventListener("dragleave", this.dragLeaveHandler)
    this._newSectionEl.addEventListener("drop", this.dropHandler)

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
  }

  renderContent() {
    const listId = `${this._projectType}-projects-list`;
    this._newSectionEl.querySelector("ul")!.id = listId;
    this._newSectionEl.querySelector(
      "h2"
    )!.textContent = `${this._projectType.toUpperCase()} PROJECTS`;
  }

  private _renderProjects() {
    const liEl = document.getElementById(
      `${this._projectType}-projects-list`
    )! as HTMLUListElement;
    liEl.innerHTML = "";
    for (const projectItem of this._assignedProjects) {
      new ProjectItem(this._newSectionEl.querySelector("ul")!.id, projectItem);
    }
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
    super("project-input", "app", true, "user-input");
    this._titleInEl = this._newSectionEl.querySelector(
      "#title"
    )! as HTMLInputElement;
    this._descInEl = this._newSectionEl.querySelector(
      "#description"
    )! as HTMLInputElement;
    this._peopleInEl = this._newSectionEl.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
  }

  renderContent() {}

  configure() {
    this._newSectionEl.addEventListener("submit", this._submitHandler);
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
      this._clearInputs();
    }
  }
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  project: Project;
  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  get persons() {
    if (this.project.people === 1) {
      return "Assigned person: 1";
    } else {
      return `Assigned persons: ${this.project.people}`;
    }
  }

  configure() {
    this._newSectionEl.addEventListener("dragstart", this.dragStartHandler)
    this._newSectionEl.addEventListener("dragend", this.dragEndHandler)
  }

  @Autobind
  dragStartHandler(event: DragEvent){
    event.dataTransfer!.setData("text/plain", this.project.id)
    event.dataTransfer!.effectAllowed = "move"
  }

  @Autobind
  dragEndHandler(event: DragEvent){
    console.log(event)
  }

  renderContent() {
    this._newSectionEl.querySelector("h2")!.textContent = this.project.title;
    this._newSectionEl.querySelector("h3")!.textContent = this.persons;
    this._newSectionEl.querySelector("p")!.textContent = this.project.desc;
  }
}

const projectState = ProjectState.getInstance();
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList(ProjectStatus.ACTIVE);
const finishedProjectList = new ProjectList(ProjectStatus.FINISHED);
