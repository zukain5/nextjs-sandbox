import { getTodosData } from '@/lib/todos';
import { GetStaticProps } from 'next';
import Head from 'next/head';

export const getStaticProps: GetStaticProps = async () => {
    const allTodosData = getTodosData();
    return {
        props: {
            allTodosData,
        },
    };
}

export default function Home({
    allTodosData,
}: {
    allTodosData: {
        id: string;
        name: string;
    }[];
}) {
    return (
        <>
            <Head>
                <title>Todo</title>
            </Head>
            <main>
                <h2>TODO List</h2>
                <ul>
                    {allTodosData.map(({ id, name }) => (
                        <li key={id}>{name}</li>
                    ))}
                </ul>
            </main>
        </>
    );
}
