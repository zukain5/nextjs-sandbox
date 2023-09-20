import 'dotenv/config';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const serviceAccount = require('../../firebase-service-account.json');
const todosFilePath = path.join(process.cwd(), 'data/todos.json');


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
  const db = getFirestore();

  if (req.method === 'GET') {
    try {
      const todosRef = db.collection('todos');
      const snapshot = await todosRef.get();
      if (snapshot.empty) {
        res.status(200).json([]);
        return;
      }

      const todos: Todo[] = [];
      snapshot.forEach((doc) => {
        todos.push({
          id: doc.id,
          name: doc.data().name,
        });
      });
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
      const newTodo = {
        id: uuidv4(),
        name,
      };
      const newTodos = [...todos, newTodo];
      fs.writeFileSync(todosFilePath, JSON.stringify(newTodos));
      res.status(200).json(newTodo);
    } catch (error) {
      console.error('Error reading and parsing JSON file:', error);
      res.status(500).json({ error: 'Failed to read JSON file' });
    }
  }
}
