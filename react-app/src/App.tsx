import React, { useState } from "react";
import { NewTodo } from "./components/NewTodo";
import { TodoList } from "./components/TodoList";
import { Todo } from "./types/todo";

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (title: string) => {
    const newTodo = {
      id: Math.random(),
      title: title,
    };

    setTodos(todos.concat(newTodo));
  };

  const removeTodo = (id: number) => {
    const removedTodos = todos.filter((todo) => todo.id !== id);

    setTodos(removedTodos);
  };

  return (
    <div className="App">
      <h3>Todo App</h3>
      <NewTodo onAddTodo={addTodo} />
      <TodoList onRemoveTodo={removeTodo} todos={todos} />
    </div>
  );
};
