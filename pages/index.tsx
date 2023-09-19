import AlertToast from '@/components/AlertToast';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [text, setText] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isErrorToastOpen, setIsErrorToastOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFailure = () => {
    setErrorMessage('Error! Task failed successfully.');
    setIsErrorToastOpen(true);
  };

  const closeErrorToast = () => {
    setIsErrorToastOpen(false);
    setErrorMessage('');
  };

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
        <div className='hero my-5'>
          <div className='hero-content text-center'>
            <h1 className='text-5xl font-bold'>TODO List</h1>
          </div>
        </div>
        <div className='text-center my-5'>
          <input className="input input-bordered input-sm" type="text" value={text} onChange={changeText} />
          <button className='btn btn-sm mx-4' onClick={addTodos}>Add</button>
        </div>
        <div className='divider max-w-lg mx-auto'></div>
        <div className='my-5'>
          <table className='table-sm mx-auto'>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.id}>
                  <td>{todo.name}</td>
                  <td><button className='btn btn-sm' onClick={() => deleteTodos(todo.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={handleFailure}>処理を失敗させる</button>
        <AlertToast isOpen={isErrorToastOpen} onClose={closeErrorToast} message={errorMessage} />
      </main>
    </>
  );
}
