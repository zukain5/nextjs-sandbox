import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

const todosFilePath = path.join(process.cwd(), 'data/todos.json');

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method === 'GET') {
        const fileContents = fs.readFileSync(todosFilePath, 'utf8');
        res.status(200).json(fileContents);
    }
}
