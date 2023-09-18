import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

const todosFilePath = path.join(process.cwd(), 'data/todos.json');

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ error: 'Missing id' });
      return;
    }
    try {
      const fileContents = fs.readFileSync(todosFilePath, 'utf8');
      const todos = JSON.parse(fileContents) as Todo[];
      const newTodos = todos.filter((todo) => todo.id !== id);
      fs.writeFileSync(todosFilePath, JSON.stringify(newTodos));
      res.status(204).end();
    } catch (error) {
      console.error('Error reading and parsing JSON file:', error);
      res.status(500).json({ error: 'Failed to read JSON file' });
    }
  }
}
