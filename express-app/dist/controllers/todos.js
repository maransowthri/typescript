"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTodo = exports.patchTodo = exports.getTodos = exports.addTodo = void 0;
const todos_1 = require("../models/todos");
let todos = [];
const addTodo = (req, res, next) => {
    const title = req.body.title;
    const newTodo = new todos_1.Todo(Math.random(), title);
    todos.push(newTodo);
    res.status(201).json({ message: "Todo created successfully" });
};
exports.addTodo = addTodo;
const getTodos = (req, res, next) => {
    res.status(200).json(todos);
};
exports.getTodos = getTodos;
const patchTodo = (req, res, next) => {
    const idToBeUpdated = +req.params.id;
    const titleToBeUpdated = req.body.title;
    todos.forEach((todo) => {
        if (todo.id === idToBeUpdated) {
            todo.title = titleToBeUpdated;
        }
    });
    res.status(200).json({ messgae: "Updated successfully" });
};
exports.patchTodo = patchTodo;
const removeTodo = (req, res, next) => {
    const idToBeDeleted = +req.params.id;
    const todoIndex = todos.findIndex((todo) => todo.id === idToBeDeleted);
    todos.splice(todoIndex, 1);
    res.status(200).json({ message: "Deleted successfully" });
};
exports.removeTodo = removeTodo;
