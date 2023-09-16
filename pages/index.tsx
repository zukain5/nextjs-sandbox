import Head from 'next/head';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [text, setText] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);

  const changeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const addTodos = () => {
    if (text === '') return;
    const newTodos = [...todos, text];
    setTodos(newTodos);
    setText('');
  };

  const deleteTodos = (index: number) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch('/api/todos');
      const todos = await response.json() as Todo[];
      setTodos(todos);
    };
    fetchTodos();
  }, []);

  return (
    <>
      <Head>
        <title>Todo</title>
      </Head>
      <main>
        <h2>TODO List</h2>
        <div>
          <input type="text" value={text} onChange={changeText} />
          <button onClick={addTodos}>Add</button>
        </div>
        <div>
          <ul>
            {todos.map((todo, index) => (
              <li key={index}>
                <p>{todo.name}</p>
                <button onClick={() => deleteTodos(index)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
