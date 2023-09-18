import Head from 'next/head';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [text, setText] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);

  const changeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const addTodos = async () => {
    if (text === '') return;
    const todo = { name: text };
    const response = await fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      console.error('Error response from server:', response);
      return;
    }
    const responseBody = await response.json();
    const newTodos = [...todos, responseBody as Todo];
    setTodos(newTodos);
    setText('');
  };

  const deleteTodos = async (id: string) => {
    const newTodos = [...todos];
    const response = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      console.error('Error response from server:', response);
      return;
    }
    newTodos.splice(
      newTodos.findIndex((todo) => todo.id === id),
      1,
    );
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
            {todos.map((todo) => (
              <li key={todo.id}>
                <p>{todo.name}</p>
                <button onClick={() => deleteTodos(todo.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
