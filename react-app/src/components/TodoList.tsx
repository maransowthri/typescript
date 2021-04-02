import React from "react";

import { Todo } from "../types/todo";

interface Props {
  todos: Todo[];
  onRemoveTodo: (id: number) => void;
}

export const TodoList: React.FC<Props> = (props) => {
  return (
    <ul>
      {props.todos.map((todo) => (
        <li key={todo.id}>
          <span>{todo.title}</span>
          <span onClick={() => props.onRemoveTodo(todo.id)}>X</span>
        </li>
      ))}
    </ul>
  );
};
