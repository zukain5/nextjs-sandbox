import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

const todosFilePath = path.join(process.cwd(), 'data/todos.json');

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const fileContents = fs.readFileSync(todosFilePath, 'utf8');
      const todos = JSON.parse(fileContents); // ファイル内容をJSONにパース
      res.status(200).json(todos);
    } catch (error) {
      console.error('Error reading and parsing JSON file:', error);
      res.status(500).json({ error: 'Failed to read JSON file' });
    }
  } else if (req.method === 'POST') {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Missing name' });
      return;
    }
    try {
      const fileContents = fs.readFileSync(todosFilePath, 'utf8');
      const todos = JSON.parse(fileContents);
      const newTodo = { name };
      const newTodos = [...todos, newTodo];
      fs.writeFileSync(todosFilePath, JSON.stringify(newTodos));
      res.status(200).json(newTodo);
    } catch (error) {
      console.error('Error reading and parsing JSON file:', error);
      res.status(500).json({ error: 'Failed to read JSON file' });
    }
  }
}
