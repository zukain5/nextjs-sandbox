import 'dotenv/config';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

const serviceAccount = require('../../firebase-service-account.json');

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
      console.error('Error getting todos from Firestore:', error);
      res.status(500).json({ error: 'Failed to get todos' });
    }
  } else if (req.method === 'POST') {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Missing name' });
      return;
    }
    try {
      const todosRef = db.collection('todos');
      const docRef = await todosRef.add({ name });
      const doc = await docRef.get();
      const newTodo = {
        id: doc.id,
        name: doc.data()?.name,
      };
      res.status(200).json(newTodo);
    } catch (error) {
      console.error('Error adding todo to Firestore:', error);
      res.status(500).json({ error: 'Failed to add todo' });
    }
  }
}
