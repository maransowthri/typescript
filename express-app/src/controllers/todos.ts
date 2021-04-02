import { RequestHandler } from "express";
import { Todo } from "../models/todos";

let todos: Todo[] = [];

export const addTodo: RequestHandler = (req, res, next) => {
  const title = req.body.title;
  const newTodo = new Todo(Math.random(), title);

  todos.push(newTodo);

  res.status(201).json({ message: "Todo created successfully" });
};

export const getTodos: RequestHandler = (req, res, next) => {
  res.status(200).json(todos);
};

export const patchTodo: RequestHandler<{ id: number }> = (req, res, next) => {
  const idToBeUpdated = +req.params.id;
  const titleToBeUpdated = req.body.title;

  todos.forEach((todo) => {
    if (todo.id === idToBeUpdated) {
      todo.title = titleToBeUpdated;
    }
  });
  res.status(200).json({ messgae: "Updated successfully" });
};

export const removeTodo: RequestHandler<{ id: number }> = (req, res, next) => {
  const idToBeDeleted = +req.params.id;
  const todoIndex = todos.findIndex((todo) => todo.id === idToBeDeleted);

  todos.splice(todoIndex, 1);
  res.status(200).json({ message: "Deleted successfully" });
};
