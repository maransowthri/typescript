import React, { useRef } from "react";

interface Props {
  onAddTodo: (title: string) => void;
}

export const NewTodo: React.FC<Props> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const formSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    props.onAddTodo(inputRef.current!.value);
  };

  return (
    <form onSubmit={formSubmitHandler}>
      <div>
        <label htmlFor="todo-title">Title</label>
        <input type="text" id="todo-title" ref={inputRef} />
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
};
