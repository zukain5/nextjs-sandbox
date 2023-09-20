import 'dotenv/config';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { NextApiRequest, NextApiResponse } from 'next';

const serviceAccount = require('../../../firebase-service-account.json');

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

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) {
      res.status(400).json({ error: 'Missing id' });
      return;
    }
    if (typeof id !== 'string') {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }
    try {
      const todosRef = db.collection('todos');
      await todosRef.doc(id).delete();
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting todo from Firestore:', error);
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  }
}
