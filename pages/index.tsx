import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
    const [text, setText] = useState<string>('');
    const [todos, setTodos] = useState<string[]>([]);

    const changeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const addTodos = () => {
        setTodos([...todos, text]);
        setText('');
    };

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
                        {todos.map((todo) => (
                            <li key={todo}>
                                <p>{todo}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </>
    );
}
