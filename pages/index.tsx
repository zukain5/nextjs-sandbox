import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
    const [text, setText] = useState<string>('');
    const [todos, setTodos] = useState<string[]>([]);

    const changeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const addTodos = () => {
        if (text === '') return;
        const newTodos = [...todos, text];
        setTodos(newTodos);
        localStorage.setItem('todos', JSON.stringify(newTodos));
        setText('');
    };

    const deleteTodos = (index: number) => {
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
        localStorage.setItem('todos', JSON.stringify(newTodos));
    };

    useEffect(() => {
        const todos = localStorage.getItem('todos');
        if (todos) {
            setTodos(JSON.parse(todos));
        }
    });

    return (
        <>
            <Head>
                <title>Todo</title>
            </Head>
            <main>
                <h2>TODO List</h2>
                <div>
                    <input type="text" value={text} onChange={changeText}/>
                    <button onClick={addTodos}>Add</button>
                </div>
                <div>
                    <ul>
                        {todos.map((todo, index) => (
                            <li key={index}>
                                <p>{todo}</p>
                                <button onClick={() => deleteTodos(index)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </>
    );
}
